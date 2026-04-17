import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("=== INICIO WEBHOOK BUILDERBOT ===");
    const payload = await req.json();
    console.log("Payload recibido:", JSON.stringify(payload, null, 2));

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Detectar dirección usando eventName (BuilderBot real payload) ──
    const eventName = payload.eventName || "unknown";
    const data = payload.data || payload;

    const isOutgoing = eventName === "message.outgoing";
    const computedDirection = isOutgoing ? 'outgoing' : 'incoming';

    // ── Extraer body: incoming usa data.body, outgoing usa data.answer ──
    const body = isOutgoing
      ? (data.answer || data.body || data.message || "")
      : (data.body || data.message || "");

    let phone = data.from || data.phone || "";

    console.log(`Evento: ${eventName} → Dirección: ${computedDirection}`);
    console.log(`Mensaje: ${body}`);
    console.log(`Teléfono crudo: ${phone}`);

    if (phone.includes("@")) {
      phone = phone.split("@")[0];
    }
    console.log(`Teléfono limpio: ${phone}`);

    // ── Detectar media/archivos adjuntos ──
    const attachments = data.attachment || data.attachments || [];
    const urlTempFile = payload.urlTempFile || data.urlTempFile || null;
    let messageType = 'text';
    let attachmentUrls: string[] | null = null;

    if (urlTempFile) {
      messageType = 'media';
      attachmentUrls = [urlTempFile];
    } else if (Array.isArray(attachments) && attachments.length > 0) {
      messageType = 'media';
      attachmentUrls = attachments;
    }

    // ── Validar campos mínimos ──
    if (!phone || (!body && !attachmentUrls)) {
      console.warn("Payload ignorado: falta phone o body/media.");
      return new Response(JSON.stringify({ status: "ignored - missing fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── Registrar/actualizar cliente (solo incoming con nombre) ──
    const pushName = payload.name || data.name || data.pushName || '';
    if (pushName && !isOutgoing) {
      await supabase.from('ng_clients').upsert({
        name: pushName,
        phone: phone
      }, { onConflict: 'phone' }).select();
    }

    // ── Deduplicación para outgoing ──
    if (isOutgoing && body) {
      const { data: recentMsg } = await supabase
        .from('ng_whatsapp_messages')
        .select('id')
        .eq('body', body)
        .eq('client_phone', phone)
        .eq('direction', 'outgoing')
        .gte('created_at', new Date(Date.now() - 15000).toISOString())
        .limit(1);

      if (recentMsg && recentMsg.length > 0) {
        console.log("Mensaje saliente duplicado. Ignorando.");
        return new Response(JSON.stringify({ success: true, reason: 'duplicate' }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // ── Insertar mensaje en la base de datos ──
    console.log(`Insertando en ng_whatsapp_messages [${computedDirection}]...`);
    const { error } = await supabase
      .from('ng_whatsapp_messages')
      .insert({
        client_phone: phone,
        body: body || 'Multimedia',
        direction: computedDirection,
        message_type: messageType,
        attachment_urls: attachmentUrls
      })
      .select();

    if (error) {
      console.error("Error INSERT:", error);
      throw error;
    }
    console.log("Inserción exitosa.");

    // ═══════════════════════════════════════════════════════════
    // ══  EDGE BOT IA — Procesa incoming y responde con GPT  ══
    // ═══════════════════════════════════════════════════════════
    if (!isOutgoing && body) {
      console.log("=== EDGE BOT: Evaluando si debe responder ===");
      
      // Leer configuración del bot
      const { data: configs } = await supabase
        .from('ng_bot_config')
        .select('key, value')
        .in('key', ['bot_enabled', 'bot_trigger', 'system_prompt']);

      const configMap: Record<string, string> = {};
      (configs || []).forEach((c: any) => { configMap[c.key] = c.value; });

      const botEnabled = configMap['bot_enabled'] === 'true';
      const botTrigger = (configMap['bot_trigger'] || '').toLowerCase().trim();
      const systemPrompt = configMap['system_prompt'] || '';

      console.log(`Bot enabled: ${botEnabled}, Trigger: "${botTrigger}"`);

      // Verificar si debe activarse:
      // - Si hay trigger, el mensaje debe contener esa palabra (para testing)
      // - Si no hay trigger, siempre responde
      const messageContainsTrigger = botTrigger 
        ? body.toLowerCase().includes(botTrigger) 
        : true;

      if (botEnabled && systemPrompt && messageContainsTrigger) {
        console.log("=== EDGE BOT: ACTIVADO — Procesando con GPT ===");
        
        try {
          // ── Obtener historial de conversación (últimos 20 msgs) ──
          const { data: history } = await supabase
            .from('ng_whatsapp_messages')
            .select('body, direction, created_at')
            .eq('client_phone', phone)
            .order('created_at', { ascending: false })
            .limit(20);

          // Armar mensajes para OpenAI (cronológico)
          const chatHistory = (history || []).reverse().map((m: any) => ({
            role: m.direction === 'incoming' ? 'user' : 'assistant',
            content: m.body || ''
          }));

          // ── Buscar productos relevantes en la BD si existe una tabla de precios ──
          let productContext = '';
          // Intentar buscar por medida si el mensaje contiene un patrón tipo "195/55 R16"
          const measureMatch = body.match(/(\d{2,3}\s*\/\s*\d{2,3}\s*R?\s*\d{2,3})/i);
          if (measureMatch) {
            const searchTerm = measureMatch[1].replace(/\s/g, '');
            console.log(`Buscando productos con medida: ${searchTerm}`);
            
            // Buscar en ng_whatsapp_messages no, buscar en catálogo si existe
            // Por ahora el catálogo está en el system prompt
          }

          // ── Llamar a OpenAI GPT ──
          const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
          
          if (!openaiKey) {
            console.error("OPENAI_API_KEY no configurada!");
            throw new Error("Missing OpenAI API Key");
          }

          const openaiMessages = [
            { role: 'system', content: systemPrompt + (productContext ? `\n\n# PRODUCTOS RELEVANTES\n${productContext}` : '') },
            ...chatHistory
          ];

          console.log(`Enviando ${openaiMessages.length} mensajes a GPT (incluyendo system)...`);
          
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4.1',
              messages: openaiMessages,
              max_tokens: 1024,
              temperature: 0.7
            })
          });

          if (!openaiRes.ok) {
            const errText = await openaiRes.text();
            console.error(`OpenAI error ${openaiRes.status}:`, errText);
            throw new Error(`OpenAI API error: ${openaiRes.status}`);
          }

          const openaiData = await openaiRes.json();
          const aiResponse = openaiData.choices?.[0]?.message?.content || '';
          
          console.log(`GPT respondió (${aiResponse.length} chars): ${aiResponse.substring(0, 100)}...`);

          if (aiResponse) {
            // ── Enviar respuesta vía BuilderBot API ──
            const bbUrl = Deno.env.get("BUILDERBOT_API_URL") || "";
            const bbKey = Deno.env.get("BUILDERBOT_API_KEY") || "";
            const bbBotId = Deno.env.get("BUILDERBOT_BOT_ID") || "";

            console.log(`Enviando respuesta vía BuilderBot a ${phone}...`);

            const sendRes = await fetch(`${bbUrl}/${bbBotId}/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-builderbot': bbKey
              },
              body: JSON.stringify({
                number: phone,
                message: aiResponse
              })
            });

            const sendResult = await sendRes.text();
            console.log(`BuilderBot send status: ${sendRes.status}`, sendResult);

            // Guardar la respuesta del bot como outgoing
            await supabase.from('ng_whatsapp_messages').insert({
              client_phone: phone,
              body: aiResponse,
              direction: 'outgoing',
              message_type: 'text'
            });

            console.log("=== EDGE BOT: Respuesta enviada y guardada ===");
          }
        } catch (botError: any) {
          console.error("ERROR en Edge Bot:", botError.message);
          // No romper el webhook por un error del bot
        }
      } else {
        console.log(`Edge Bot inactivo. enabled=${botEnabled}, trigger="${botTrigger}", contains=${messageContainsTrigger}`);
      }
    }

    console.log("=== FIN WEBHOOK ===");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("!!! ERROR FATAL EN WEBHOOK !!!", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

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
      
      // Obtener el estado del cliente para ver si el bot está pausado
      const { data: dbClient } = await supabase.from('ng_clients').select('bot_paused_until').eq('phone', phone).single();
      
      const triggerWord = "asistente";
      const isTriggerWord = body.toLowerCase().includes(triggerWord);
      
      let isPaused = false;
      if (dbClient && dbClient.bot_paused_until) {
        const pausedUntil = new Date(dbClient.bot_paused_until).getTime();
        if (pausedUntil > Date.now()) {
          isPaused = true;
        }
      }

      if (isPaused) {
        if (isTriggerWord) {
          console.log(`=== EDGE BOT: Palabra Trigger detectada ("${triggerWord}"). Reactivando bot... ===`);
          await supabase.from('ng_clients').update({ bot_paused_until: null }).eq('phone', phone);
          
          const welcomeMsg = "¡Hola de nuevo! Ya estoy activo para ayudarte. ¿En qué nos quedamos? 🤖";
          const bbUrl = Deno.env.get("BUILDERBOT_API_URL") || "";
          const bbKey = Deno.env.get("BUILDERBOT_API_KEY") || "";
          const bbBotId = Deno.env.get("BUILDERBOT_BOT_ID") || "";
          
          await fetch(`${bbUrl}/${bbBotId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-builderbot': bbKey },
            body: JSON.stringify({ number: phone, messages: { content: welcomeMsg } })
          });
          
          await supabase.from('ng_whatsapp_messages').insert({ client_phone: phone, body: welcomeMsg, direction: 'outgoing', message_type: 'text' });
          return new Response(JSON.stringify({ success: true, reason: 'bot_reactivated' }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
        } else {
          console.log(`=== EDGE BOT: Silenciado por Human Handoff (hasta ${new Date(dbClient.bot_paused_until).toLocaleString()}). Ignorando msj. ===`);
          return new Response(JSON.stringify({ success: true, reason: 'bot_paused' }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
        }
      }

      // Leer configuración del bot
      const { data: configs } = await supabase
        .from('ng_bot_config')
        .select('key, value')
        .in('key', ['bot_enabled', 'bot_trigger', 'system_prompt']);

      const configMap: Record<string, string> = {};
      (configs || []).forEach((c: any) => { configMap[c.key] = c.value; });

      const botEnabled = configMap['bot_enabled'] === 'true';
      const botTriggerConfig = (configMap['bot_trigger'] || '').toLowerCase().trim();
      
      // Auto-Adaptive Profile & Human Handoff Instructions
      const adaptiveInstructions = `
[REGLA DE PERFIL AUTO-ADAPTABLE]: 
Analiza la longitud y complejidad del último mensaje del cliente. Si el cliente escribe menos de 5 palabras o respuestas muy cerradas, tú debes responder con formato 'Ejecutivo Express' (Muy directo, hiper-resumido, máximo 15 palabras). Si el cliente pide detalles técnicos, hace preguntas largas o tiene dudas complejas, responde con formato 'Asesor Experto' (Detallado, persuasivo y técnico).

[REGLA DE FORMATO VISUAL WHATSAPP]:
NUNCA utilices formato estructurado de Markdown como '###', '####' o '**'. WhatsApp no los renderiza bien. En su lugar, utiliza SIEMPRE Emojis variados para hacer viñetas o destacar secciones, espacios en blanco (saltos de línea) para que "respire" la lectura, y asteriscos simples para las negritas de WhatsApp (Ejemplo: 🛞 *Michelin LTX Trail ST*). Tu respuesta debe verse hermosa, amigable y sumamente legible en un teléfono celular, usando emojis de autos, herramientas, checkmarks, billetes, etc.

[REGLA DE PASE A HUMANO (HUMAN HANDOFF)]:
Si el cliente solicita EXPLÍCITAMENTE hablar con un vendedor humano, asesor o persona real (ej: "pasame con un vendedor", "quiero hablar con alguien", "pasame con un humano", etc.), DEBES incluir obligatoriamente al inicio de tu respuesta el texto "__HUMAN_HANDOFF__". 
Luego de esa etiqueta, despídete amablemente del cliente informando que lo comunicas con un experto, y avísale que si quiere volver a hablar con el asistente de IA, debe escribir la palabra "ASISTENTE". (Ejemplo: "__HUMAN_HANDOFF__ Entendido, te voy a derivar con un experto de nuestro equipo. En cuanto se desocupe alguien te escribe por acá mismo. 👨‍🔧 (Si quieres volver a hablar conmigo, solo escribe la palabra ASISTENTE).")`;

      const systemPrompt = (configMap['system_prompt'] || '') + '\n\n' + adaptiveInstructions;

      console.log(`Bot enabled: ${botEnabled}, TriggerConfig: "${botTriggerConfig}"`);

      // Verificar si debe activarse (para pruebas locales o activador manual global si existiese)
      const messageContainsTrigger = botTriggerConfig 
        ? body.toLowerCase().includes(botTriggerConfig) 
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

          // ── Buscar productos relevantes en la BD ──
          let productContext = '';
          
          // Buscar por medida si el mensaje contiene un patrón tipo "195/55 R16"
          const measureMatch = body.match(/(\d{2,3}\s*\/\s*\d{2,3}\s*R?\s*\d{2,3})/i);
          // Buscar por marca
          const brandKeywords = ['michelin', 'bridgestone', 'continental', 'pirelli', 'dunlop', 'goodyear', 'yokohama', 'hankook', 'nexen', 'fate', 'firestone', 'westlake', 'linglong', 'giti', 'kumho', 'falken', 'laufenn', 'bfgoodrich', 'chaoyang', 'windforce', 'firemax', 'triangle'];
          const bodyLower = body.toLowerCase();
          const mentionedBrand = brandKeywords.find(b => bodyLower.includes(b));

          if (measureMatch) {
            const searchMeasure = measureMatch[1].replace(/\s/g, '');
            console.log(`Buscando productos con medida: ${searchMeasure}`);
            
            const { data: products } = await supabase
              .from('ng_products')
              .select('name, brand, measure, price, stock')
              .ilike('measure', `%${searchMeasure}%`)
              .gt('stock', 0)
              .order('price', { ascending: true });

            if (products && products.length > 0) {
              productContext = `\n\n# PRODUCTOS DISPONIBLES PARA MEDIDA ${searchMeasure}\n`;
              products.forEach((p: any) => {
                productContext += `- ${p.name} → Precio Lista: $${p.price.toLocaleString()} | Stock: ${p.stock} unidades\n`;
              });
              console.log(`Encontrados ${products.length} productos para medida ${searchMeasure}`);
            }
          } else if (mentionedBrand) {
            console.log(`Buscando productos de marca: ${mentionedBrand}`);
            const { data: products } = await supabase
              .from('ng_products')
              .select('name, brand, measure, price, stock')
              .ilike('brand', `%${mentionedBrand}%`)
              .gt('stock', 0)
              .order('price', { ascending: true })
              .limit(15);

            if (products && products.length > 0) {
              productContext = `\n\n# PRODUCTOS DISPONIBLES DE ${mentionedBrand.toUpperCase()}\n`;
              products.forEach((p: any) => {
                productContext += `- ${p.name} → Precio Lista: $${p.price.toLocaleString()} | Stock: ${p.stock}\n`;
              });
              console.log(`Encontrados ${products.length} productos de ${mentionedBrand}`);
            }
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
              model: 'gpt-4o-mini',
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
          let aiResponse = openaiData.choices?.[0]?.message?.content || '';
          
          console.log(`GPT respondió (${aiResponse.length} chars): ${aiResponse.substring(0, 100)}...`);

          if (aiResponse) {
            
            // ── Procesar Human Handoff si existe ──
            const handoffTrigger = '__HUMAN_HANDOFF__';
            if (aiResponse.includes(handoffTrigger)) {
              console.log("=== EDGE BOT: HUMAN HANDOFF DETECTADO ===");
              aiResponse = aiResponse.replace(handoffTrigger, '').trim();
              
              // Suspender bot por 24 hs
              const pauseUntilDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
              const { error: handoffErr } = await supabase.from('ng_clients').update({ bot_paused_until: pauseUntilDate.toISOString() }).eq('phone', phone);
              if (handoffErr) console.error("Error al pausar el bot:", handoffErr);
            }

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
                messages: { content: aiResponse }
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

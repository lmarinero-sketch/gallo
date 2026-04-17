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

    // BuilderBot usa "message.incoming" y "message.outgoing" como eventName
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

    // Limpiar phone string (quitar @s.whatsapp.net si existe)
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
      console.log(`Media (urlTempFile): ${urlTempFile}`);
    } else if (Array.isArray(attachments) && attachments.length > 0) {
      messageType = 'media';
      attachmentUrls = attachments;
      console.log(`Media (attachment): ${JSON.stringify(attachments)}`);
    }

    // ── Validar campos mínimos requeridos ──
    if (!phone || (!body && !attachmentUrls)) {
      console.warn("Payload ignorado: falta phone o body/media.");
      console.warn(`phone="${phone}", body="${body}", attachments=${JSON.stringify(attachmentUrls)}`);
      return new Response(JSON.stringify({ status: "ignored - missing fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── Registrar/actualizar cliente (solo para incoming con nombre) ──
    const pushName = payload.name || data.name || data.pushName || '';
    if (pushName && !isOutgoing) {
      console.log(`Registrando/actualizando cliente: ${pushName} (${phone})`);
      await supabase.from('ng_clients').upsert({
        name: pushName,
        phone: phone
      }, { onConflict: 'phone' }).select();
    }

    // ── Deduplicación para outgoing (evitar doble insert desde UI + webhook) ──
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
        console.log("Mensaje saliente duplicado detectado. Ignorando inserción del webhook.");
        return new Response(JSON.stringify({ success: true, reason: 'duplicate' }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // ── Insertar mensaje en la base de datos ──
    console.log(`Insertando en ng_whatsapp_messages [${computedDirection}]...`);
    const { error, data: dbData } = await supabase
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
      console.error("Error EN EL INSERT de la base de datos:", error);
      throw error;
    }
    
    console.log("¡Inserción exitosa! Datos guardados:", dbData);
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

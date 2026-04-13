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

    const eventName = payload.eventName || "unknown";
    const data = payload.data || payload;
    const body = data.body || data.message || "";
    let phone = data.from || data.phone || "";

    console.log(`Evento interpretado: ${eventName}`);
    console.log(`Mensaje: ${body}`);
    console.log(`Teléfono crudo de origen: ${phone}`);

    // Limpiar string
    if (phone.includes("@")) {
      phone = phone.split("@")[0];
    }
    console.log(`Teléfono limpio para BD: ${phone}`);

    const urlTempFile = payload.urlTempFile || data.urlTempFile || null;
    let messageType = 'text';
    if (urlTempFile) {
       messageType = 'media';
       console.log(`Media detectada: ${urlTempFile}`);
    }

    if (!phone || (!body && !urlTempFile)) {
      console.warn("Payload ignorado debido a falta de phone o body/media.");
      return new Response(JSON.stringify({ status: "ignored - missing fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const pushName = payload.name || data.name || data.pushName || '';
    if (pushName) {
      console.log(`Intentando registrar cliente nuevo: ${pushName} (${phone})`);
      await supabase.from('ng_clients').insert({
        name: pushName,
        phone: phone
      }).select(); // Fallará silenciosamente si el teléfono ya existe (UNIQUE), que es lo que queremos.
    }

    console.log("Insertando en ng_whatsapp_messages...");
    // Insert message history
    const { error, data: dbData } = await supabase
      .from('ng_whatsapp_messages')
      .insert({
        client_phone: phone,
        body: body || 'Multimedia',
        direction: 'incoming',
        message_type: messageType,
        attachment_urls: urlTempFile ? [urlTempFile] : null
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

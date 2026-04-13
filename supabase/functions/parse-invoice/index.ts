import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text: invoiceText } = await req.json();
    
    if (!invoiceText) {
      return new Response(JSON.stringify({ error: "No text provided" }), { 
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const prompt = `
    Eres un estructurador experto de datos. Analiza el siguiente texto extraído de un PDF de una factura (posiblemente Factura A, B, C de AFIP o remito interno argentino) y extrae la información en un formato JSON estricto con las siguientes claves:
    1. "clientName": El nombre del cliente. Búscalo cerca de "Señores", "Razón Social:", "Señor(es):", "Nombre:", o "Cliente:". No incluyas el CUIT en el nombre.
    2. "phone": El número telefónico. Búscalo cerca de "Tel", "Teléfono", "Celular". Formateado preferentemente sin guiones, con + si es posible. Si no hay teléfono, devuelve nulo o "".
    3. "date": La fecha de facturación (o "Fecha de Emisión"). Conviértela SIEMPRE al formato ISO "YYYY-MM-DD".
    4. "amount": El importe total final a pagar (Importe Total / Total). Entrégalo como un número (ej. 150000.50), no como texto.
    5. "items": Una lista (array de strings) con únicamente los nombres de los productos o servicios adquiridos (ej. "Cubierta Fate 205/55R16", "Alineación 3D"). No incluyas impuestos (IVA, IIBB) en esta lista.
    
    Asegúrate de responder SOLO con un objeto JSON válido, sin delimitadores de código (no markdown).

    Texto extraído del PDF:
    ${invoiceText}
    `;

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const openAiData = await openAiResponse.json();
    const parsedData = JSON.parse(openAiData.choices[0].message.content);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_id, product_type, price, title, user_id, success_url, cancel_url } = await req.json();

    if (!product_id || !product_type || !price || !title || !user_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY");
    if (!PAYMONGO_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "PayMongo not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amountInCentavos = Math.round(price * 100);

    const paymongoRes = await fetch("https://api.paymongo.com/v1/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(PAYMONGO_SECRET_KEY + ":"),
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            description: title,
            remarks: JSON.stringify({ user_id, product_id, product_type }),
          },
        },
      }),
    });

    const paymongoData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error("PayMongo error:", JSON.stringify(paymongoData));
      return new Response(JSON.stringify({ error: "Payment creation failed", details: paymongoData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const checkoutUrl = paymongoData.data.attributes.checkout_url;

    return new Response(JSON.stringify({ url: checkoutUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

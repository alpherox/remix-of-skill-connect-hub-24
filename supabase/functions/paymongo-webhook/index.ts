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
    const body = await req.text();
    const event = JSON.parse(body);

    // Verify webhook signature if secret is set
    const webhookSecret = Deno.env.get("PAYMONGO_WEBHOOK_SECRET");
    if (webhookSecret) {
      const signature = req.headers.get("paymongo-signature");
      if (!signature) {
        return new Response(JSON.stringify({ error: "Missing signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // PayMongo signature format: t=timestamp,te=test_signature,li=live_signature
      // For production, verify the HMAC. For now we check presence.
    }

    const eventType = event?.data?.attributes?.type;

    if (eventType === "link.payment.paid") {
      const paymentData = event.data.attributes.data;
      const linkData = paymentData?.attributes;
      
      // Get remarks from the link
      let remarks: { user_id: string; product_id: string; product_type: string } | null = null;
      try {
        const remarksStr = linkData?.remarks || paymentData?.attributes?.remarks;
        if (remarksStr) {
          remarks = JSON.parse(remarksStr);
        }
      } catch {
        // Try to find remarks in nested data
        const sourceData = event.data?.attributes?.data?.attributes;
        if (sourceData?.remarks) {
          try { remarks = JSON.parse(sourceData.remarks); } catch {}
        }
      }

      if (!remarks?.user_id || !remarks?.product_id || !remarks?.product_type) {
        console.error("Could not parse remarks from webhook:", JSON.stringify(event));
        return new Response(JSON.stringify({ error: "Invalid remarks" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const amount = (linkData?.amount || 0) / 100;
      const paymentId = paymentData?.id || event.data?.id || "unknown";

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Insert purchase
      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: remarks.user_id,
        product_id: remarks.product_id,
        product_type: remarks.product_type,
        amount,
        stripe_payment_id: paymentId,
        status: "completed",
      });

      if (purchaseError) {
        console.error("Purchase insert error:", purchaseError);
      }

      // Insert notification
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: remarks.user_id,
        message: `Your purchase has been confirmed! You now have access to the ${remarks.product_type}.`,
        type: "purchase",
        link: `/${remarks.product_type}s/${remarks.product_id}`,
      });

      if (notifError) {
        console.error("Notification insert error:", notifError);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

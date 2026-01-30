import "@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  try {
    // 1️⃣ Parse request
    const { product_id } = await req.json();

    if (!product_id) {
      return new Response(
        JSON.stringify({ error: "product_id missing" }),
        { status: 400 }
      );
    }

    // 2️⃣ Supabase admin client
    const supabase = createClient(
      Deno.env.get("SB_URL")!,
      Deno.env.get("SB_SERVICE_ROLE_KEY")!
    );

    // 3️⃣ Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, product_name, slug")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      throw new Error("Product not found");
    }

    // 4️⃣ Get waitlist users (not notified yet)
    const { data: waitlist, error: waitlistError } = await supabase
      .from("product_waitlist")
      .select("id, email")
      .eq("product_id", product_id)
      .eq("notified", false);

    if (waitlistError) {
      throw new Error("Failed to fetch waitlist");
    }

    if (!waitlist || waitlist.length === 0) {
      return new Response(
        JSON.stringify({ message: "No waitlist users" }),
        { status: 200 }
      );
    }

    // 5️⃣ Send email to each user
    // for (const user of waitlist) {
    //   await fetch(`${Deno.env.get("SITE_URL")}/api/send-email`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       to: user.email,
    //       type: "PRODUCT_BACK_IN_STOCK",
    //       data: {
    //         productName: product.product_name,
    //         productUrl: `${Deno.env.get("SITE_URL")}/product/${product.slug}`,
    //       },
    //     }),
    //   });
    // }
for (const user of waitlist){
    console.log("Would send email to:", user.email);
}
    // 6️⃣ Mark all as notified
    await supabase
      .from("product_waitlist")
      .update({ notified: true })
      .eq("product_id", product_id)
      .eq("notified", false);

    return new Response(
      JSON.stringify({
        success: true,
        notifiedUsers: waitlist.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Notify waitlist error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // ✅ Direct import

// ✅ Service role client banao
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("API HIT - body:", body); // ← Pehle yeh check karo

    const { data: orderData, error } = await supabase
      .from("orders")
      .insert([{
        user_id: body.user_id,
        seller_name: body.seller_name,
        seller_email: body.seller_email,
        units: body.units,
        budget: body.budget,
        revenue: body.revenue,
        ingram_account: body.ingram_account,
        quote: body.quote,
        segment: body.segment,
        manufacturer: body.manufacturer,
        is_reseller: body.is_reseller,
        company_name: body.company_name,
        contact_name: body.contact_name,
        contact_email: body.contact_email,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        delivery_date: body.delivery_date || null,
        estimated_close_date: body.estimated_close_date || null,
        notes: body.notes,
        cart_items: body.cart_items,
        status: "pending"
      }])
      .select("id, order_number")
      .single();

    if (error) {
      console.log("Supabase error:", error); // ← Error dekho
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ orderData }, { status: 200 });

  } catch (err) {
    console.log("Catch error:", err); // ← Catch dekho
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ orderData }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
// src/app/api/admin-orders/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // 🔐 Server-side Supabase (RLS bypass)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔹 Fetch ALL orders
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, seller_email, revenue, delivery_date, created_at, status")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data });

  } catch (err) {
    console.error("Admin orders API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

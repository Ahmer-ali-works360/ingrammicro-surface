// src/app/api/report-a-win/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      user_id,
      submitted_by,
      reseller,
      product,
      isOther,
      otherDesc,
      resellerAccount,
      orderHash,
      customerName,
      units,
      revenue,
      purchaseType,
      purchaseDate,
      notes,
    } = body;

    const { error } = await supabase
      .from("win_reports")
      .insert([
        {
          order_id,
          user_id,
          product_id: product,
          submitted_by,
          isOther,
          otherDesc,
          reseller,
          resellerAccount,
          orderHash,
          customerName,
          units,
          deal_rev: revenue,
          purchaseType,
          purchaseDate,
          notes,
        },
      ]);

    if (error) {
      return NextResponse.json(
        { error: "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

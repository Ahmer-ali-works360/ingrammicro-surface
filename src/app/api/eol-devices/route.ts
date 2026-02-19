// src/app/api/eol-devices/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, submitted_by, products, notes } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    // 🔹 Get next submission_id
    const { data: submissionId, error: seqError } =
      await supabase.rpc("get_next_eol_submission_id");

    if (seqError || !submissionId) {
      return NextResponse.json(
        { error: "Submission ID error" },
        { status: 500 }
      );
    }

    // 🔹 Prepare rows (same submission_id for all)
    const rowsToInsert = products.map((product: any) => ({
      submission_id: submissionId,
      user_id,
      submitted_by,
      product_name: product.product_name,
      sku: product.sku,
      quantity: product.quantity,
      address: product.address,
      notes: notes || null, // 👈 global notes
    }));

    const { error } = await supabase
      .from("eol_device")
      .insert(rowsToInsert);

    if (error) {
      return NextResponse.json(
        { error: "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      submission_id: submissionId
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

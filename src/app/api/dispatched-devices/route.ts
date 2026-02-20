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
      user_id,
      submitted_by,
      tracking_number,
      shipment_date,
      products,
    } = body;

    if (
      !user_id ||
      !submitted_by ||
      !tracking_number ||
      !shipment_date ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ 1️⃣ Get next submission_id
    const { data: submission_id, error: seqError } =
      await supabase.rpc("get_next_dispatch_submission_id");

    if (seqError) {
      return NextResponse.json(
        { error: seqError.message },
        { status: 500 }
      );
    }

    // ✅ 2️⃣ Prepare rows (one per product)
    const rows = products.map((p: any) => ({
      submission_id,
      user_id,
      submitted_by,
      tracking_number,
      shipment_date,
      product_name: p.product_name,
      sku: p.sku,
      quantity: Number(p.quantity),
      inventory_owner: p.inventory_owner,
    }));

    const { error: insertError } = await supabase
      .from("dispatched_device")
      .insert(rows);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Dispatch submitted successfully", submission_id },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
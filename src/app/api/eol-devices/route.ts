//src/app/api/eol-devices/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, submitted_by, products } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    // Get next submission_id
    const { data: submissionId, error: seqError } =
      await supabase.rpc("get_next_eol_submission_id");

    if (seqError || !submissionId) {
      return NextResponse.json(
        { error: "Submission ID error" },
        { status: 500 }
      );
    }

    const rowsToInsert = products.map((product: any) => ({
      submission_id: submissionId,
      user_id,
      submitted_by,
      product_name: product.product_name,
      sku: product.sku,
      quantity: product.quantity,
      address: product.address,
      notes: product.notes,
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

    /* ===============================
       📧 SEND EMAIL AFTER SUCCESS
    =============================== */

    try {
      await fetch(`/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [
            "ahmer.ali@worls360.com",
            "email2@example.com",
            submitted_by  
          ],
          type: "EOL_DEVICE_SUBMITTED",
          data: {
            submitted_by,
            address: products[0]?.address,
            notes: products[0]?.notes,
            products,
          },
        }),
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Important: We are NOT failing the request
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

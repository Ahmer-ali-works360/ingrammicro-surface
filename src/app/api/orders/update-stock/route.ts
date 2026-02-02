import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ SERVICE ROLE KEY use karo (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items } = body;

    if (!orderId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    // 🔁 Loop through ordered products
    for (const item of items) {
      const productId = item.product_id;
      const orderedQty = item.quantity;

      // 1️⃣ Get current stock
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();

      if (fetchError || !product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }

      // 2️⃣ Check stock availability
      if (product.stock_quantity < orderedQty) {
        return NextResponse.json(
          {
            message: `Insufficient stock for product ${productId}`,
          },
          { status: 400 }
        );
      }

      // 3️⃣ Update stock
      const newStock = product.stock_quantity - orderedQty;

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);

      if (updateError) {
        return NextResponse.json(
          { message: "Failed to update stock" },
          { status: 500 }
        );
      }
    }

    // ✅ All products updated successfully
    return NextResponse.json(
      { message: "Stock updated successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("UPDATE STOCK ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

//src/app/api/admin-orders/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* =========================
   GET: single order detail
========================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error("GET admin order error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT: update order details (tracking etc)
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
const data = body.data;

    if ("return_label" in data && !data.return_label) {
  delete data.return_label;
}

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from("orders")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("PUT order update error:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT admin order error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}



/* =========================
   PATCH: update order status
========================= */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status, role } = await req.json();

      const normalizedRole = role?.toLowerCase();

    /* ================= AUTH USER (EMAIL) ================= */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    const approverEmail = user?.email ?? null;
    const performedBy = user?.id ?? null;


    /* ================= ADMIN CLIENT ================= */
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /* ================= CURRENT STATUS ================= */
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, order_number")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    /* ================= ROLE RULES ================= */
    if (normalizedRole === "program_manager") {
      if (order.status !== "pending") {
        return NextResponse.json(
          { error: "Order already processed" },
          { status: 400 }
        );
      }

      if (!["approved", "rejected"].includes(status)) {
        return NextResponse.json(
          { error: "Program manager not allowed for this status" },
          { status: 403 }
        );
      }
    }

    /* ================= UPDATE ================= */
    const updateData: any = { status };

    // ================= DEMO LOGIC =================

const now = new Date();
const nowISO = now.toISOString();

// 🟢 FIRST TIME SHIPPED → ACTIVATE DEMO
if (order.status !== "shipped" && status === "shipped") {
  updateData.shipped_at = nowISO;

  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + 30);

  updateData.demo_expiry_date = expiryDate.toISOString();
  updateData.demo_status = "active";
}

// 🔴 RETURNED → STOP DEMO
if (order.status !== "return" && status === "return") {
  updateData.returned_at = nowISO;
  updateData.demo_status = "stopped";
}

// ❌ REJECTED → STOP DEMO
if (order.status !== "rejected" && status === "rejected") {
  updateData.rejected_at = nowISO;
  updateData.demo_status = "stopped";
}

    if (["approved", "rejected"].includes(status)) {
  updateData.approved_at = new Date().toISOString();
  updateData.approved_by = approverEmail;
}


    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    if (status === "rejected" || status === "return") {
  const { data: orderDetails } = await supabaseAdmin
    .from("orders")
    .select("cart_items")
    .eq("id", id)
    .single();

  if (orderDetails?.cart_items) {
    for (const item of orderDetails.cart_items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();

      if (product) {
        await supabaseAdmin
          .from("products")
          .update({
            stock_quantity: product.stock_quantity + item.quantity,
          })
          .eq("id", item.product_id);
      }
    }
  }
}




    /* 👇 YAHAN LOG INSERT AAYEGA */

    // ================= INSERT AUDIT LOG =================
const { error: logError } = await supabaseAdmin
  .from("order_status_logs")
  .insert({
    order_id: order.id,
    order_number: order.order_number,
    old_status: order.status,
    new_status: status,
    performed_by: performedBy,
    performed_role: normalizedRole ?? approverEmail,
    performed_email: approverEmail,
  });

if (logError) {
  console.error("❌ Failed to insert order status log:", logError);
  // intentionally NOT blocking main flow
}



    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH admin order error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

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

    /* ================= ADMIN CLIENT ================= */
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /* ================= CURRENT STATUS ================= */
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("status")
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH admin order error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

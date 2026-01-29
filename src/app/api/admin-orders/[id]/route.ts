import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ IMPORTANT: await params
    const { id } = await context.params;

    console.log("🔑 SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "🔑 SERVICE ROLE KEY (first 10 chars):",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10)
    );
    console.log("🔎 ORDER ID (resolved):", id);

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
      console.error("❌ SUPABASE ERROR:", error);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error("🔥 Admin order detail API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

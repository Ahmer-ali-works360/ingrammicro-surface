// src/app/api/notifications/count/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch only unread notifications
    const { data, error } = await supabase
      .from("notifications")
      .select("type")
      .eq("is_read", false);

    if (error) {
      console.error("❌ Notification count error:", error);
      return NextResponse.json(
        { error: "Failed to fetch notification count" },
        { status: 500 }
      );
    }

    // Count by type
    const userCount = data.filter(n => n.type === "user").length;
    const orderCount = data.filter(n => n.type === "order").length;

    return NextResponse.json({
      users: userCount,
      orders: orderCount,
      total: userCount + orderCount,
    });

  } catch (err) {
    console.error("🔥 Notification count API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

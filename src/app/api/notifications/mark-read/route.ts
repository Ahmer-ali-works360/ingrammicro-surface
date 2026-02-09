// src/app/api/notifications/mark-read/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ SERVICE ROLE KEY use karo (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    if (!type || !["user", "order"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("type", type)
      .eq("is_read", false);

    if (error) {
      console.error("❌ Mark read failed:", error);
      return NextResponse.json(
        { error: "Failed to mark notifications as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("🔥 Mark read API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

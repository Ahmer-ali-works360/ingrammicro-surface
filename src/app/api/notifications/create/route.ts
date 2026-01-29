// src/app/api/notifications/create/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { type, event, reference_id } = body;

    // Basic validation
    if (!type || !event || !reference_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Allow only supported notification types
    if (!["user", "order"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    // Insert notification
    const { error } = await supabase
      .from("notifications")
      .insert({
        type,
        event,
        reference_id,
        is_read: false,
      });

    if (error) {
      console.error("❌ Notification insert failed:", error);
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("🔥 Notification API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

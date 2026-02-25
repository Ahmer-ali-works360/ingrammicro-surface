import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const today = new Date();
    const todayISO = today.toISOString();

    // 1️⃣ Fetch relevant orders only
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .in("demo_status", ["active", "expired"])
      .is("returned_at", null);

    if (error) {
      throw error;
    }

    for (const order of orders || []) {
      const expiryDate = new Date(order.demo_expiry_date);
      const diffTime = today.getTime() - expiryDate.getTime();
      const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // =========================
      // 🔔 25 DAY REMINDER
      // =========================
      if (
        order.demo_status === "active" &&
        daysOverdue === -5 // 5 days before expiry
      ) {
        await sendEmail("DEMO_REMINDER_25", order);
      }

      // =========================
      // ⏰ EXPIRE AT DAY 30
      // =========================
      if (
        order.demo_status === "active" &&
        today >= expiryDate
      ) {
        await supabaseAdmin
          .from("orders")
          .update({ demo_status: "expired" })
          .eq("id", order.id);
      }

      // =========================
      // 📧 OVERDUE EMAILS
      // =========================
      if (
        order.demo_status === "expired" &&
        daysOverdue > 0 &&
        daysOverdue % 5 === 0 &&
        daysOverdue <= 20 // up to day 50
      ) {
        await sendEmail(`DEMO_OVERDUE_${daysOverdue}`, order);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CRON ERROR:", err);
    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}

async function sendEmail(type: string, order: any) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: order.seller_email,
      type,
      data: {
        orderId: order.id,
        order_number: order.order_number,
        demo_expiry_date: order.demo_expiry_date,
      },
    }),
  });
}
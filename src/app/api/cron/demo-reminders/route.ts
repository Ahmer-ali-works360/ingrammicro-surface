//src/app/api/cron/demo-reminders/route.ts

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

        if (!order.demo_expiry_date) continue;

      const expiryDate = new Date(order.demo_expiry_date);
      const diffTime = today.getTime() - expiryDate.getTime();
      const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // =========================
      // 🔔 25 DAY REMINDER
      // =========================
     if (
  order.demo_status === "active" &&
  daysOverdue === -5
) {

  const todayDate = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabaseAdmin
    .from("demo_email_logs")
    .select("id")
    .eq("order_id", order.id)
    .eq("email_type", "DEMO_REMINDER_25")
    .eq("sent_on", todayDate)
    .maybeSingle();

  if (!existing) {
    await sendEmail("DEMO_REMINDER_25", order);

    await supabaseAdmin.from("demo_email_logs").insert({
      order_id: order.id,
      email_type: "DEMO_REMINDER_25",
      sent_on: todayDate
    });
  }
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
          order.demo_status = "expired";
      }

      // =========================
      // 📧 OVERDUE EMAILS
      // =========================
      if (
  order.demo_status === "expired" &&
  daysOverdue > 0 &&
  daysOverdue % 5 === 0 &&
  daysOverdue <= 20
) {

  const todayDate = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabaseAdmin
    .from("demo_email_logs")
    .select("id")
    .eq("order_id", order.id)
    .eq("email_type", `DEMO_OVERDUE_${daysOverdue}`)
    .eq("sent_on", todayDate)
    .maybeSingle();

  if (!existing) {
    await sendEmail("DEMO_OVERDUE", order, daysOverdue);

    await supabaseAdmin.from("demo_email_logs").insert({
      order_id: order.id,
      email_type: `DEMO_OVERDUE_${daysOverdue}`,
      sent_on: todayDate
    });
  }
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

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "-"); // → 26-Feb-2025
}

async function sendEmail(type: string, order: any, daysOverdue?: number) {
  const recipients = [
    order.seller_email,           // Seller
    order.contact_email,          // Contact/Customer
    "ahmer.ali@works360.com",     // Admin
    // "koi.aur@example.com",     // Aur log add karo yahan
  ].filter(Boolean); // removes null/undefined emails

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: recipients, // ✅ Array of emails
      type,
      data: {
        orderId: order.id,
        order_number: order.order_number,
        demo_expiry_date: formatDate(order.demo_expiry_date),
        days_overdue: daysOverdue ?? 0,

        sellerName: order.seller_name,
        sellerEmail: order.seller_email,
        companyName: order.company_name,
        contactName: order.contact_name,
        contact_email: order.contact_email,
        shippedAt: formatDate(order.shipped_at),

        orderItems: order.cart_items?.map((item: any) => ({
          productName: item.product_name,
          sku: item.sku,
          quantity: item.quantity,
        })) || [],
      },
    }),
  });

  const result = await response.text();
  console.log("EMAIL API RESPONSE:", result);
}
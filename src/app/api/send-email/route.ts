//src/app/api/send-email/route.ts

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { to, type, data } = await req.json();

    if (!to || !type) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Get template
    const { subject, html } = getEmailTemplate(type, data);

    // 2️⃣ SMTP (Mailtrap – testing)
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    // 3️⃣ Send email
    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

     // Check SMTP config
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ SMTP environment variables not configured!");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Get template
    const { subject, html } = getEmailTemplate(type, data);
 //  Create SMTP transporter (Outlook/Works360)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // false for 587
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

   // Email options
    const mailOptions: any = {
      from: process.env.SMTP_FROM_NAME 
        ? `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`
        : process.env.SMTP_FROM_EMAIL!,
      to,
      subject,
      html,
    };

    // Add BCC in development
    if (process.env.NODE_ENV === 'development' && process.env.SMTP_BCC_EMAIL) {
      mailOptions.bcc = process.env.SMTP_BCC_EMAIL;
    }

   //  Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    });

  } catch (error: any) {
    console.error("❌ Email sending failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to send email" 
      },
      { status: 500 }
    );
  }
}
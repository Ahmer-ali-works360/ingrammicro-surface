import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  // IP address nikalna (security ke liye important)
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    const body = await req.json();
    const { email, password } = body;

    // 🟡 Login attempt log
    logger.info(
      { email, ip },
      "Login attempt started"
    );

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // 🔴 Failed login
    if (error) {
      logger.warn(
        { email, ip, reason: error.message },
        "Login failed"
      );

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🟢 Successful login
    logger.info(
      { userId: data.user.id, ip },
      "Login successful"
    );

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err: any) {
    // 🔥 Unexpected error
    logger.error(
      { ip, err },
      "Login API crashed"
    );

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

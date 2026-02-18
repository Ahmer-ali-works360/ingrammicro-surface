import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  } as any
);

}

// Simple in-memory rate limiter (consider using Redis for production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (attempt.count >= maxAttempts) {
    return false;
  }

  attempt.count++;
  return true;
}



export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  // IP address nikalna (security ke liye important)
 const ip = req.headers
  .get("x-forwarded-for")
  ?.split(",")[0] ?? "unknown";

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    logger.warn(
      { ip },
      "Login rate limit exceeded"
    );
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();


    // Input validation
    if (!email || !password) {
      logger.warn(
        { ip },
        "Login attempt with missing credentials"
      );
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn(
        { email, ip },
        "Login attempt with invalid email format"
      );
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 🟡 Login attempt log
    logger.info(
      { email, ip },
      "Login attempt started"
    );

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
  password: cleanPassword,
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

// Check if the user's status is 'approved' in the 'profiles' table
const { data: profileData, error: profileError } = await supabase
  .from('profiles') // Correct table name is 'profiles'
  .select('status')
  .eq('id', data.user.id) 
  .single();

// Log the profile data and status for debugging
logger.info({ profileData, status: profileData?.status }, "Profile Data and Status Check");

if (profileError || profileData?.status !== 'approved') {
  // If the user is not approved, log them out and return an error response
  await supabase.auth.signOut();
  logger.warn(
    { userId: data.user.id, ip },
    "User not approved, logged out"
  );
  return NextResponse.json(
    { error: "Your account is not approved yet." },
    { status: 403 } // Forbidden
  );
}
    

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err: unknown) {
    // 🔥 Unexpected error
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    logger.error(
      { ip, err: errorMessage },
      "Login API crashed"
    );

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

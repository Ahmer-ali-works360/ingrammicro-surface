import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("🔄 PROXY RUNNING:", pathname);

  // 🚫 Skip API routes & static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // ✅ Create Supabase server client (Edge-safe)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options) => {
          const cookieOptions = {
            ...options,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          };
          req.cookies.set({ name, value, ...cookieOptions });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value, ...cookieOptions });
        },
        remove: (name: string, options) => {
          const cookieOptions = {
            ...options,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          };
          req.cookies.set({ name, value: "", ...cookieOptions });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value: "", ...cookieOptions });
        },
      },
    }
  );

 // 🔒 CRITICAL: Check for recovery link FIRST before getting session
  const isRecovery = req.nextUrl.searchParams.get("type") === "recovery";

  // ✅ If recovery link, ALWAYS allow through to reset-password page
  if (isRecovery) {
    console.log("🔑 Recovery link detected - allowing access to reset-password");
    
    // Redirect to reset-password if not already there
    if (!pathname.startsWith("/reset-password")) {
      const url = new URL("/reset-password", req.url);
      url.search = req.nextUrl.search; // Preserve all query params
      return NextResponse.redirect(url);
    }
    
    // Already on reset-password page with recovery token - allow through
    return res;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🐛 DEBUG LOGS
  console.log("=== DEBUG INFO ===");
  console.log("📍 Pathname:", pathname);
  console.log("🔐 Session exists:", !!session);
  console.log("👤 User email:", session?.user?.email || "NO SESSION");
  console.log("🍪 Cookies count:", req.cookies.getAll().length);
  console.log("🔑 Is Recovery:", isRecovery);
  console.log("==================");

  // ✅ Public routes (no auth required)
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔐 Redirect to login if NOT authenticated and NOT on public route
  if (!session && !isPublicRoute) {
    console.log("❌ No session - redirecting to login");
    const loginUrl = new URL("/login", req.url);
    
    // Save original destination for redirect after login
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
      console.log("💾 Saving redirect path:", pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect authenticated users away from login pages (but NOT reset-password)
  if (session && isPublicRoute && !isRecovery) {
    console.log("✅ Has session - redirecting away from login");
    
    // ✅ CRITICAL: Don't redirect from reset-password without recovery param
    if (pathname.startsWith("/reset-password")) {
      console.log("⚠️ On reset-password without recovery token - redirect to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    const redirectTo = req.nextUrl.searchParams.get("redirect");
    let destination = "/";
    
    // Use redirect parameter if valid
    if (redirectTo && redirectTo !== "/login" && !publicRoutes.includes(redirectTo)) {
      destination = redirectTo;
    }
    
    console.log("🎯 Redirecting to:", destination);
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // ✅ Allow access to protected routes with valid session
  if (session && !isPublicRoute) {
    console.log("✅ Authenticated access granted to:", pathname);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
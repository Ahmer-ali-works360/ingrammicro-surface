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
            maxAge: 60 * 60 * 24 * 7,
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

  // 🔒 CRITICAL: Check for recovery link FIRST
  const isRecovery = req.nextUrl.searchParams.get("type") === "recovery";
  const recoveryToken = req.nextUrl.searchParams.get("token");

  // ✅ If recovery link, FORCE redirect to reset-password and block everything else
  if (isRecovery || recoveryToken) {
    console.log("🔑 Recovery link detected - blocking all pages except reset-password");
    
    // Only allow /reset-password page during recovery
    if (!pathname.startsWith("/reset-password")) {
      console.log("⚠️ Recovery token present but not on reset-password - FORCING redirect");
      const url = new URL("/reset-password", req.url);
      url.search = req.nextUrl.search; // Preserve query params
      return NextResponse.redirect(url);
    }
    
    // On reset-password page with recovery token - allow through
    console.log("✅ Allowing access to reset-password page with recovery token");
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
    
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
      console.log("💾 Saving redirect path:", pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect authenticated users away from public pages
  if (session && isPublicRoute) {
    console.log("✅ Has session - checking if should redirect from public route");
    
    // Allow reset-password without recovery token (user wants to change password while logged in)
    if (pathname.startsWith("/reset-password")) {
      console.log("⚠️ Authenticated user on reset-password without recovery - allowing");
      return res;
    }
    
    const redirectTo = req.nextUrl.searchParams.get("redirect");
    let destination = "/";
    
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
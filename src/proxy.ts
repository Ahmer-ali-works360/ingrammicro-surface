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
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          };
          req.cookies.set({ name, value, ...cookieOptions });
          res = NextResponse.next({
            request: { headers: req.headers },
          });
          res.cookies.set({ name, value, ...cookieOptions });
        },
        remove: (name: string, options) => {
          const cookieOptions = {
            ...options,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          };
          req.cookies.set({ name, value: "", ...cookieOptions });
          res = NextResponse.next({
            request: { headers: req.headers },
          });
          res.cookies.set({ name, value: "", ...cookieOptions });
        },
      },
    }
  );

/* =====================================================
   🔐 RECOVERY LOCK LOGIC
===================================================== */

const recoveryMode =
  req.cookies.get("sb-recovery-mode")?.value === "true";

// 🔒 If recovery mode active → allow ONLY reset-password page
if (recoveryMode) {
  if (!pathname.startsWith("/reset-password")) {
    console.log("⛔ Recovery mode active - blocking:", pathname);
    return NextResponse.redirect(new URL("/reset-password", req.url));
  }

  console.log("✅ Recovery mode - allowing reset-password only");
  return res;
}


  /* =====================================================
     🔐 NORMAL AUTH FLOW (UNCHANGED)
  ===================================================== */

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("=== DEBUG INFO ===");
  console.log("📍 Pathname:", pathname);
  console.log("🔐 Session exists:", !!session);
  console.log("👤 User email:", session?.user?.email || "NO SESSION");
  console.log("==================");

  const publicRoutes = ["/login", "/forgot-password", "/reset-password", "/account-registration"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔐 Redirect to login if NOT authenticated
  if (!session && !isPublicRoute) {
    console.log("❌ No session - redirecting to login");

    const loginUrl = new URL("/login", req.url);

    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Redirect authenticated users away from public pages
  if (session && isPublicRoute) {
    if (pathname.startsWith("/reset-password")) {
      return res;
    }

    const redirectTo = req.nextUrl.searchParams.get("redirect");
    let destination = "/";

    if (
      redirectTo &&
      redirectTo !== "/login" &&
      !publicRoutes.includes(redirectTo)
    ) {
      destination = redirectTo;
    }

    return NextResponse.redirect(new URL(destination, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};

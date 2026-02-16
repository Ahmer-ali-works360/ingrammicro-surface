import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("PROXY RUNNING:", pathname);

  // 🚫 Skip API routes & static files
  if (
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)
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
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options) => {
          req.cookies.set({ name, value: "", ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ✅ Public routes (no auth required)
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔒 Recovery link handling
  const isRecovery = req.nextUrl.searchParams.get("type") === "recovery";

  if (isRecovery && !pathname.startsWith("/reset-password")) {
    const url = new URL("/reset-password", req.url);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url);
  }

  // 🔐 Redirect to login if NOT authenticated and NOT on public route
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect authenticated users away from login pages
  if (session && isPublicRoute && !isRecovery) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

// ✅ Matcher: Exclude static files, images, and API routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
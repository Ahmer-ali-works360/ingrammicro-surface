import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Server-side sign out
  await supabase.auth.signOut();

  // Create response
  const response = NextResponse.json({ success: true });

  // Manually remove all Supabase cookies
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set({
        name: cookie.name,
        value: '',
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
  });

  return response;
}
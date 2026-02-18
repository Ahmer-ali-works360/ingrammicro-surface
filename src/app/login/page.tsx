//src/app/login/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";



function LoginPageContent() {
  const router = useRouter();
  const { syncSession } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true); // UI only
  const [loading, setLoading] = useState(false);


   // Custom toast styles

const isMobile = window.innerWidth < 640;
const toastOptions = {
  success: {
    duration: 7000,
    style: {
      background: '#54c500',
        color: '#fff',
        borderRadius: '8px',
        fontSize: isMobile ? '11px' : '12px',
        fontWeight: '400',
        minWidth: isMobile ? '200px' : '320px',
        maxWidth: isMobile ? '280px' : '500px',
        padding: isMobile ? '10px 14px' : '16px 20px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    duration: 4000,
    style: {
      background: '#ef4444',
        color: '#fff',
        minWidth: isMobile ? '200px' : '320px',
        maxWidth: isMobile ? '280px' : '500px',
        padding: isMobile ? '10px 14px' : '16px 20px',
        borderRadius: '8px',
        fontSize: isMobile ? '11px' : '12px',
        fontWeight: '400',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
};

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        router.push(redirectTo || "/");
      }
    });
  }, [router, redirectTo]);

  // Handle login
  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const result = await res.json();

    setLoading(false);

   

   if (!res.ok) {
  toast.error(result.error || "Login failed", toastOptions.error);
  return;
}

// ✅ Login successful
toast.success("Login successful! Redirecting...", toastOptions.success);

// ✅ Sync session first
await syncSession();

// ✅ CRITICAL FIX: Force router refresh to update middleware
router.refresh();

// ✅ Small delay then redirect with window.location for hard refresh
setTimeout(() => {
  const destination = redirectTo || "/";
  window.location.href = destination; // ✅ Hard redirect instead of router.push
}, 800);

  
  } catch (err) {
    setLoading(false);
    toast.error("Something went wrong. Please try again.", toastOptions.error);
  }
}


  return (
  <>
    <Toaster 
  position="top-right"
  containerStyle={{
    top: 60,  // Page ke top se 60px neeche
  }}
  toastOptions={{
    style: {
      marginRight: '20px',  // Right side se 20px spacing
    },
  }}
/>

    <div className="relative min-h-screen flex items-start sm:items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: "url('/computer-mouse-object-background.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white opacity-95 z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-105 sm:max-w-120 bg-white border-8 sm:border-10 border-[#F9F9F9] p-6 sm:p-10 md:p-12 rounded-md animate-slide-up">
        <h1 className="text-[20px] sm:text-[22px] font-semibold mb-6 text-[#222] text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[13px] sm:text-[14px] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d1d1d1] px-3 py-2.5 text-[14px] rounded-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] sm:text-[14px] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d1d1d1] px-3 py-2.5 text-[14px] rounded-sm"
            />
          </div>

          {/* Keep me signed in */}
          <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-[#AAAAAA]">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
            <span>Keep me signed in</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3ba1da] cursor-pointer text-white py-2.75 text-[14px] font-medium rounded-sm hover:bg-[#44b0ec]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <a
              href="/account-registration"
              className="w-full text-center cursor-pointer bg-[#e5e5e5] text-[#333] py-2.75 text-[14px] font-medium rounded-sm hover:bg-[#dcdcdc]"
            >
              Register
            </a>
          </div>
        </form>

        <div className="text-center mt-5 text-[13px] sm:text-[14px] text-[#AAAAAA]">
          <a href="/forgot-password" className="hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  </>
);
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

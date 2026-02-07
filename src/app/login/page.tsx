"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true); // UI only
  const [loading, setLoading] = useState(false);

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
        email,
        password,
      }),
    });

    const result = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(result.error);
      return;
    }

    router.push(redirectTo || "/");
  } catch (err) {
    setLoading(false);
    toast.error("Something went wrong. Please try again.");
  }
}

  return (
  <>
    <Toaster position="top-right" />

    <div className="relative min-h-screen flex items-start sm:items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: "url('/computer-mouse-object-background.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white opacity-95 z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] bg-white border-[8px] sm:border-[10px] border-[#F9F9F9] p-6 sm:p-10 md:p-12 rounded-[6px] animate-slide-up">
        <h1 className="text-[20px] sm:text-[22px] font-[600] mb-6 text-[#222] text-center">
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
              className="w-full border border-[#d1d1d1] px-3 py-[10px] text-[14px] rounded-[4px]"
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
              className="w-full border border-[#d1d1d1] px-3 py-[10px] text-[14px] rounded-[4px]"
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
              className="w-full bg-[#3ba1da] text-white py-[11px] text-[14px] font-[500] rounded-[4px] hover:bg-[#44b0ec]"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <a
              href="/account-registration"
              className="w-full text-center bg-[#e5e5e5] text-[#333] py-[11px] text-[14px] font-[500] rounded-[4px] hover:bg-[#dcdcdc]"
            >
              REGISTER
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

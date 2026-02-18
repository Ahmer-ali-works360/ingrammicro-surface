// src/app/forgot-password/page.tsx 

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Success message

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");


  // ✅ Dynamic redirect URL - production ya local automatically detect karega
  const resetUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    : `${window.location.origin}/reset-password`;
    
    
    // Supabase reset link
 
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetUrl,
  });

    console.log("Supabase Response:", { data, error }); 

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      return;
    }

    // Always show neutral message to prevent email enumeration
    setMessage(
      "If this email exists in our system, a password reset link has been sent."
    );
    setEmail(""); // clear input
  }

  return (
   <div className="relative min-h-screen flex flex-col items-center pt-16 sm:pt-24 pb-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: "url('/computer-mouse-object-background.jpg')" }}
      />
      <div className="absolute inset-0 bg-white opacity-95 z-0" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-[480px] mx-4 sm:mx-0 bg-white border-[10px] border-[#F9F9F9] p-6 sm:p-12 rounded-[6px] animate-slide-up">
        <h1 className="text-[22px] font-[600] mb-6 text-[#222] text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-[14px] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d1d1d1] px-3 py-[10px] text-[14px] rounded-[4px]"
              placeholder="Enter your email"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3ba1da] text-white py-[11px] text-[14px] font-[500] rounded-[4px] hover:bg-[#44b0ec]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-[14px] text-[#555]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

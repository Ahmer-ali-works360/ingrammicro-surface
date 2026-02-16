//src/app/reset-password/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // ✅ Check for URL errors (expired/invalid link)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDesc = searchParams.get("error_description");

    if (errorParam === "access_denied" && errorCode === "otp_expired") {
      setError("This reset link has expired. Please request a new one.");
    } else if (errorParam) {
      setError(errorDesc?.replace(/\+/g, " ") || "Invalid reset link.");
    }
  }, [searchParams]);

  // ✅ Ensure recovery session is properly detected
  useEffect(() => {
    // 1️⃣ Check if session already exists (page reload case)
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("✅ Existing session found");
        setSessionReady(true);
      }
    };

    checkExistingSession();

    // 2️⃣ Listen for PASSWORD_RECOVERY event
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔔 Auth event:", event);
        if (event === "PASSWORD_RECOVERY" && session) {
          console.log("✅ Password recovery session detected");
          setSessionReady(true);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setLoading(false);
      console.error("Password update error:", updateError);
      setMessage(updateError.message || "Something went wrong.");
      return;
    }

    setMessage("Password updated successfully! Redirecting to login...");

    // ✅ Important: Logout after password reset (security fix)
    setTimeout(async () => {
      await supabase.auth.signOut();
      
      // ✅ Hard redirect to clear all sessions
      window.location.href = "/login";
    }, 2000);
  }

  // ✅ Show error if link is expired/invalid
  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="w-[420px] bg-white p-10 rounded shadow">
          <h1 className="text-xl font-semibold mb-6 text-center text-red-600">
            Link Invalid or Expired
          </h1>
          
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>

          <a
            href="/forgot-password"
            className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-[420px] bg-white p-10 rounded shadow">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        {!sessionReady && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
            ⏳ Loading recovery session... Please wait.
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!sessionReady}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!sessionReady}
          />

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
//src/app/reset-password/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // ✅ Ensure recovery session is properly detected
  useEffect(() => {
    // 1️⃣ Check if session already exists (page reload case)
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      }
    };

    checkExistingSession();

    // 2️⃣ Listen for PASSWORD_RECOVERY event
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
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

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong.");
      return;
    }

    setMessage("Password updated successfully! Redirecting...");

    // ✅ Important: Logout after password reset (security fix)
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
    }, 2000);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-[420px] bg-white p-10 rounded shadow">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
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
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

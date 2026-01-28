"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AccountRegistrationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reseller, setReseller] = useState("");

  /* ---------------------------------------------
     EMAIL CALL (Next.js API Route)
     UI / Supabase logic untouched
  --------------------------------------------- */
async function sendEmail(payload: {
  to: string;
  type: string;
  data: any;
}) {
  try {
    console.log(
      "📧 [EMAIL] Sending:",
      payload.type,
      "→",
      payload.to
    );

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(
        "❌ [EMAIL FAILED]",
        payload.type,
        result
      );
    } else {
      console.log(
        "✅ [EMAIL SENT]",
        payload.type,
        "→",
        payload.to
      );
    }
  } catch (err) {
    console.error(
      "🔥 [EMAIL ERROR]",
      payload.type,
      err
    );
  }
}


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    /**
     * 1️⃣ CREATE AUTH USER
     */
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("User creation failed");
      return;
    }

    /**
     * 2️⃣ INSERT PROFILE DATA
     */
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        reseller: reseller.trim(),
        role: "subscriber",
        status: "pending",
      });

    if (profileError) {
      setLoading(false);
      alert(profileError.message);
      return;
    }

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

    /**
     * 3️⃣ SEND EMAILS
     */

    // 👉 Admin notification
    await sendEmail({
      to: "ahmer.ali.works360@gmail.com",
      type: "NEW_USER_REGISTRATION",
      data: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        reseller: reseller.trim(),
      },
    });


    // ⏳ WAIT 15 seconds (Mailtrap free limit)
await wait(15000);
    // 👉 User confirmation (registration received)
    await sendEmail({
      to:email.trim(),
      type: "USER_REGISTERED",
      data: {
        name: firstName.trim(),
      },
    });

    await supabase.auth.signOut();

    setLoading(false);
    setShowSuccessModal(true);
  }

  return (
  <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
    {/* Background */}
    <div
      className="absolute inset-0 bg-center bg-cover z-0"
      style={{ backgroundImage: "url('/computer-mouse-object-background.jpg')" }}
    />
    <div className="absolute inset-0 bg-white opacity-95 z-0" />

    {/* Form Card */}
    <div className="relative z-10 w-full max-w-[480px] bg-white border-[8px] sm:border-[10px] border-[#F9F9F9] 
      p-6 sm:p-8 md:p-10 lg:p-12 rounded-[6px] animate-slide-up">
      
      <h1 className="text-[22px] sm:text-[24px] md:text-[28px] font-semibold text-gray-900 mb-6 text-center">
        Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Email (Username)
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Reseller
          </label>
          <input
            type="text"
            required
            value={reseller}
            onChange={(e) => setReseller(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#3ba1da] text-white py-[11px] px-8 text-[14px] font-[500] rounded-[4px] hover:bg-[#44b0ec]"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>

    {/* Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white w-full max-w-[420px] rounded-md p-6 shadow-lg text-center animate-fade-in">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-3">
            Registration Successful
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            User registration successful. You can login when admin approves
            your registration.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto bg-[#3ba1da] text-white px-6 py-2 text-sm rounded hover:bg-[#44b0ec]"
          >
            OK
          </button>
        </div>
      </div>
    )}
  </div>
);
}
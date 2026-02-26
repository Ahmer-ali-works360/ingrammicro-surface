//src/app/account/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"account" | "password">("account");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        return;
      }

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      }
    };

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      await loadProfile(session.user.id);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", user.id);

    if (error) {
      console.error("Update error:", error);
      alert("Update failed: " + error.message);
      return;
    }

    alert("Profile updated successfully!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        alert("Old password is incorrect!");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        alert("Password change failed: " + updateError.message);
        return;
      }

      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong while changing password.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">

      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-1/4 bg-gray-200 p-4 rounded-md">

        {/* Silhouette Icon + Email */}
        <div className="flex flex-col items-center gap-3 mb-6">

          {/* Big User Silhouette Circle */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#4799D5" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>

          <p className="font-semibold text-sm text-center break-all">{user.email}</p>
        </div>

        {/* MENU */}
        <nav className="flex flex-row md:flex-col gap-2 text-sm w-full">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center justify-between px-3 py-2 rounded w-full transition ${
              activeTab === "account" ? "bg-blue-200" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center justify-between px-3 py-2 rounded w-full transition ${
              activeTab === "password" ? "bg-blue-200" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium text-gray-700 text-xs sm:text-sm whitespace-nowrap">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>
        </nav>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-3/4 bg-white p-4 sm:p-6 rounded-md shadow-md flex flex-col gap-4">
        {activeTab === "account" ? (
          <form onSubmit={handleUpdateAccount} className="flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Account</h1>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="custom-blue mt-2 text-white px-4 py-2 rounded transition text-sm sm:text-base"
            >
              Update Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Change Password</h1>

            {/* Old Password */}
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-2 top-1/2 -translate-y-1/2">
                {showOld ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2">
                {showNew ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2">
                {showConfirm ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            <button
              type="submit"
              className="custom-blue mt-2 text-white px-4 py-2 rounded transition text-sm sm:text-base"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
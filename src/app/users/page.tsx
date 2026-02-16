"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Check, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  reseller: string;
  role: string;
  status: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // ----------------------------
  // 🔒 AUTH + ADMIN CHECK
  // ----------------------------
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session?.user) {
        router.replace("/login?redirect=/users");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .single();
        console.log("ROLE FROM DB:", profileData?.role);

      const allowedRoles = ["admin", "program manager"];

if (error || !allowedRoles.includes(profileData?.role)) {
  router.replace("/");
  return;
}

      setAuthLoading(false);
    };

    checkAdmin();
  }, [router]);

  // ----------------------------
  // Fetch Users
  // ----------------------------
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, reseller, role, status, created_at"
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data as Profile[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ----------------------------
  // Approve / Reject
  // ----------------------------
const updateStatus = async (
  user: Profile,
  status: "approved" | "rejected"
) => {
  setUpdatingId(user.id);

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", user.id);

  if (!error) {
    const userData = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      reseller: user.reseller,
      loginUrl: `${window.location.origin}/login`,
    };

    // 1️⃣ USER KO EMAIL
    const userEmailType =
      status === "approved" ? "USER_APPROVED" : "USER_REJECTED";

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: user.email,
        bcc: process.env.SMTP_BCC_EMAIL,
        type: userEmailType,
        data: userData,
      }),
    });

    // 2️⃣ ADMIN/PM KO EMAIL
    const adminEmailType =
      status === "approved" ? "ADMIN_USER_APPROVED" : "ADMIN_USER_REJECTED";

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "ahmer.ali.works360@gmail.com",
         bcc: process.env.SMTP_BCC_EMAIL, 
        type: adminEmailType,
        data: userData,
      }),
    });

    fetchUsers();
  }

  setUpdatingId(null);
};
  // ----------------------------
  // Search Filter
  // ----------------------------
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text =
        `${u.first_name} ${u.last_name} ${u.email} ${u.reseller}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [users, search]);

  // ----------------------------
  // Download Excel
  // ----------------------------
  const downloadExcel = () => {
    if (filteredUsers.length === 0) return;

        const data = filteredUsers.map((u) => {
      const date = new Date(u.created_at);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return {
        Name: `${u.first_name} ${u.last_name}`,
        Email: u.email,
        Reseller: u.reseller,
        Role: u.role,
        Status: u.status,
        "Registered At": `${formattedDate}, ${formattedTime}`,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (authLoading) return null;

  return (
    <div className="p-8">


      {/* Right aligned download + search */}
      <div className="flex flex-col items-end gap-3 mb-4">
        <img
          src="/download-excel.png"
          alt="Download Excel"
          className="w-36 h-14 cursor-pointer hover:opacity-80"
          onClick={downloadExcel}
        />

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 border border-gray-300 rounded-md px-3 py-2 top-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Center heading
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-900">Users Approval</h1> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#3a8bc7] text-white border-b">

            <tr>
              <th colSpan={6} className="px-4 py-4 text-center text-3xl font-semibold">
                User Approval
              </th>
            </tr>
          </thead>
          <thead className="bg-blue-50 text-blue-900 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Reseller</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Registered At</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => {
                const date = new Date(user.created_at);
                const formattedDate = date.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.reseller}</td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3">
                      {formattedDate}, {formattedTime}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {user.status === "pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            disabled={updatingId === user.id}
                            onClick={() =>
                              updateStatus(user, "approved")
                            }
                            className="
                            cursor-pointer
                            flex items-center gap-1.5
                            rounded-md px-3 py-1.5 text-xs font-medium
                            bg-green-600
                            text-white
                            hover:bg-green-800
                            disabled:opacity-50
                          "
                          >
                            <Check size={14} />
                            Approve
                          </button>

                          <button
                            disabled={updatingId === user.id}
                            onClick={() => updateStatus(user, "rejected")}
                            className="cursor-pointer
                          flex items-center gap-1.5
                          rounded-md px-3 py-1.5 text-xs font-medium
                          border border-red-500
                          text-red-600
                          bg-transparent
                          hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600
                          hover:text-white
                          disabled:opacity-50
                        "
                          >
                            <X size={14} />
                            Reject
                          </button>

                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

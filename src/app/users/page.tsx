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

  // **NEW: auth loading state**
  const [authLoading, setAuthLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false); // newest first

  // **Status filter state**
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "rejected" | "pending"
  >("all");

  // ----------------------------
  // 🔒 AUTH + ADMIN CHECK
  // ----------------------------
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      // if user is not logged in
      if (!sessionData?.session?.user) {
        router.replace("/login");
        return;
      }

      // if logged in, check role from profiles
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .single();

      if (error || profileData?.role !== "admin") {
        router.replace("/");
        return;
      }

      // if admin
      setAuthLoading(false);
    };

    checkAdmin();
  }, [router]);

  // Fetch users
  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, reseller, role, status, created_at"
      )
      .order("created_at", { ascending: sortAsc });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data as Profile[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, [sortAsc]);

  // Approve / Reject
  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdatingId(id);

    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);

    if (!error) {
      fetchUsers();
    }

    setUpdatingId(null);
  }

  // Search filter
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const text =
          `${u.first_name} ${u.last_name} ${u.email} ${u.reseller}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
      .filter((u) => {
        if (statusFilter === "all") return true;
        return u.status === statusFilter;
      });
  }, [users, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Download Excel
  function downloadExcel() {
    if (paginatedUsers.length === 0) return;

    const data = paginatedUsers.map((u) => ({
      Name: `${u.first_name} ${u.last_name}`,
      Email: u.email,
      Reseller: u.reseller,
      Role: u.role,
      Status: u.status,
      "Registered At": new Date(u.created_at).toLocaleString(),
    }));

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
    a.download = `users_page_${page}.xlsx`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // **NEW: prevent page render until auth confirmed**
  if (authLoading) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Users Management</h1>

      {/* Top Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-72 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* **Status Filter Dropdown** */}
        <div className="flex items-center gap-2 text-sm">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>

          <span>Users per page</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <img
            src="/download-excel.png"
            alt="Download Excel"
            className="w-36 h-14 cursor-pointer hover:opacity-80"
            onClick={downloadExcel}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-50 text-blue-900 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left  ">Name</th>
              <th className="px-4 py-3 text-left  ">Email</th>
              <th className="px-4 py-3 text-left  ">Reseller</th>
              {/* <th className="px-4 py-3 text-left  ">Role</th> */}
              <th className="px-4 py-3 text-left  ">Status</th>
              <th
                className="px-4 py-3 text-left cursor-pointer  "
                onClick={() => setSortAsc(!sortAsc)}
              >
                Registered At {sortAsc ? "↑" : "↓"}
              </th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Loading users...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition hover:bg-blue-50/40 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium  ">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-3  ">{user.email}</td>
                  <td className="px-4 py-3  ">{user.reseller}</td>
                  {/* <td className="px-4 py-3   capitalize">{user.role}</td> */}
                  <td className="px-4 py-3  ">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : user.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3  ">
                    {new Date(user.created_at).toLocaleString()}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-4 py-3 text-center">
                    {user.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        {/* Approve */}
                        <button
                          disabled={updatingId === user.id}
                          onClick={() => updateStatus(user.id, "approved")}
                          className="
                            flex items-center gap-1.5
                            rounded-md px-3 py-1.5 text-xs font-medium
                            bg-gradient-to-r from-green-500 to-green-600
                            text-white shadow-sm
                            hover:from-green-600 hover:to-green-700
                            focus:outline-none focus:ring-2 focus:ring-green-400
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all
                          "
                        >
                          {updatingId === user.id ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            <>
                              <Check size={14} />
                              Approve
                            </>
                          )}
                        </button>

                        {/* Reject */}
                        <button
                          disabled={updatingId === user.id}
                          onClick={() => updateStatus(user.id, "rejected")}
                          className="
                            flex items-center gap-1.5
                            rounded-md px-3 py-1.5 text-xs font-medium
                            bg-gradient-to-r from-red-500 to-red-600
                            text-white shadow-sm
                            hover:from-red-600 hover:to-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-400
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all
                          "
                        >
                          {updatingId === user.id ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            <>
                              <X size={14} />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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

export default function UserRolePage() {
  const router = useRouter();

  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Current logged in user role
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // **NEW: auth loading**
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch users
  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, reseller, role, status, created_at"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: sortAsc });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data as Profile[]);
    }

    setLoading(false);
  }

  // Fetch current user role
  async function fetchCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) return;

    const userId = data.user?.id;
    if (!userId) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setCurrentUserRole(profileData?.role || "");
  }

  // ----------------------------
  // 🔒 AUTH + ACCESS CHECK
  // ----------------------------
  useEffect(() => {
    const checkAccess = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      // if user is not logged in
      if (!sessionData?.session?.user) {
        router.replace("/login");
        return;
      }

      // fetch role from profiles
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .single();

      if (error) {
        router.replace("/");
        return;
      }

      const role = profileData?.role?.toLowerCase() || "";

      // only admin or program manager can open
      if (role !== "admin" && role !== "program manager") {
        router.replace("/");
        return;
      }

      // allow page
      setCurrentUserRole(role);
      setAuthLoading(false);
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      fetchUsers();
    }
  }, [sortAsc, authLoading]);

  // Open modal when role changes
  function handleRoleChange(user: Profile, newRole: string) {
    if (currentUserRole.toLowerCase() !== "admin") return;

    setSelectedUser(user);
    setSelectedRole(newRole);
    setIsModalOpen(true);
  }

  // Confirm role update
  async function confirmRoleUpdate() {
    if (!selectedUser) return;

    setUpdatingId(selectedUser.id);

    const { error } = await supabase
      .from("profiles")
      .update({ role: selectedRole })
      .eq("id", selectedUser.id);

    if (!error) {
      fetchUsers();
    }

    setUpdatingId(null);
    setIsModalOpen(false);
    setSelectedUser(null);
  }

  // Cancel role update
  function cancelRoleUpdate() {
    setIsModalOpen(false);
    setSelectedUser(null);
  }

  // Search filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text =
        `${u.first_name} ${u.last_name} ${u.email} ${u.reseller}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [users, search]);

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
      {/* <h1 className="text-3xl font-semibold mb-6">User Role Management</h1> */}

      {/* Top Controls */}
      {/* <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
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

        <div className="flex items-center gap-2 text-sm">
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
      </div> */}

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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#3a8bc7] text-white border-b">

            <tr>
              <th colSpan={6} className="px-4 py-4 text-center text-3xl font-semibold">
                User Role Management
              </th>
            </tr>
          </thead>
          <thead className="bg-blue-50 text-blue-900 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Reseller</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Registered At {sortAsc ? "↑" : "↓"}
              </th>
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
                  <td className="px-4 py-3 font-medium">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.reseller}</td>

                  {/* Role Dropdown */}
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={currentUserRole.toLowerCase() !== "admin"}
                      onChange={(e) =>
                        handleRoleChange(user, e.target.value)
                      }
                      className={`border rounded px-2 py-1 text-sm ${
                        currentUserRole.toLowerCase() !== "admin"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="program manager">Program Manager</option>
                      <option value="shop manager">Shop Manager</option>
                      <option value="subscriber">Subscriber</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleString()}
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

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Role Change
            </h2>
            <p className="text-sm text-gray-700 mb-5">
              Are you sure to change the role of{" "}
              <span className="font-medium">
                {selectedUser.first_name} {selectedUser.last_name}
              </span>{" "}
              to <span className="font-semibold">{selectedRole}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelRoleUpdate}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                No
              </button>

              <button
                onClick={confirmRoleUpdate}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

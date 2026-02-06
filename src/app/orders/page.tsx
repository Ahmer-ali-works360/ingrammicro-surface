"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/app/context/AuthContext";

type Order = {
  id: string;
  order_number: number;
  seller_email: string;
  revenue: number;
  delivery_date: string | null;
  status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // 🔐 Auth check
  const { loading: authLoading, isAllowed } = useAuthRole([
    "admin",
    "program_manager",
    "shop_manager",
  ]);

  // 🚫 Redirect if not allowed
  useEffect(() => {
    if (!authLoading && !isAllowed) {
      router.replace("/");
    }
  }, [authLoading, isAllowed, router]);

  // 📦 Fetch orders (ONLY after auth)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-orders");
      const result = await res.json();

      if (res.ok && result.orders) {
        setOrders(result.orders as Order[]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && isAllowed) {
      fetchOrders();
    }
  }, [authLoading, isAllowed]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const text = `${o.id} ${o.seller_email}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [orders, search]);

  const downloadExcel = () => {
    if (filteredOrders.length === 0) return;

    const data = filteredOrders.map((o) => ({
      "Order ID": o.id,
      "Seller Email": o.seller_email,
      Revenue: o.revenue,
      Status: o.status,
      "Delivery Date": o.delivery_date
        ? new Date(o.delivery_date).toLocaleDateString()
        : "-",
      "Created At": new Date(o.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

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
    a.download = "orders.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (authLoading) return null;

  /* ================= UI ================= */
  return (

    <div className="p-8">

      {/* Download + Search */}
      <div className="flex flex-col items-end gap-3 mb-4">
        <img
          src="/download-excel.png"
          alt="Download Excel"
          className="w-36 h-14 cursor-pointer hover:opacity-80"
          onClick={downloadExcel}
        />

        <input
          type="text"
          placeholder="Search order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 text-gray-700 border-b">
            <tr>
              <th colSpan={6} className="px-4 py-4 text-center text-3xl font-semibold">
                Orders List
              </th>
            </tr>
          </thead>

          <thead className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 text-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Seller Email</th>
              <th className="px-4 py-3 text-left">Revenue</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Delivery Date</th>
              <th className="px-4 py-3 text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-blue-50/40 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td
                    className="px-4 py-3 font-medium text-blue-600 cursor-pointer underline"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    #{order.order_number}
                  </td>
                  <td className="px-4 py-3">{order.seller_email}</td>
                  <td className="px-4 py-3">${order.revenue}</td>
                  <td className="px-4 py-3">
                    <span
  className={`px-3 py-1 rounded-full text-xs font-medium capitalize
    ${
      order.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : order.status === "approved"
        ? "bg-gray-200 text-gray-700"
        : order.status === "rejected"
        ? "bg-red-100 text-red-800"
        : order.status === "shipped"
        ? "bg-green-100 text-green-800"
        : order.status === "return"
        ? "bg-orange-100 text-orange-800"
        : order.status === "shipped_extension"
        ? "bg-purple-100 text-purple-800"
        : "bg-gray-100 text-gray-500"
    }
  `}
>
  {order.status.replace("_", " ")}
</span>

                  </td>
                  <td className="px-4 py-3">
                    {order.delivery_date
                      ? new Date(order.delivery_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

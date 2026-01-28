"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
      } else {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchLatestOrder();
  }, [router]);

  if (loading) return null;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          No order found
        </h2>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* THANK YOU MESSAGE */}
      <div className="bg-green-50 border border-green-300 rounded p-6 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          🎉 Thank You for Your Order!
        </h1>
        <p className="text-gray-700">
          Your order has been submitted successfully. Our team will review it shortly.
        </p>
      </div>

      {/* ORDER DETAILS */}
      <div className="bg-white border rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Order Details</h2>

        {/* STATUS */}
        <div>
          <span className="font-semibold">Order Status:</span>

          {order.status === "pending" && (
            <span className="ml-2 px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700">
              ⏳ Pending Approval
            </span>
          )}

          {order.status === "approved" && (
            <span className="ml-2 px-3 py-1 text-sm rounded bg-green-100 text-green-700">
              ✅ Approved
            </span>
          )}

          {order.status === "rejected" && (
            <span className="ml-2 px-3 py-1 text-sm rounded bg-red-100 text-red-700">
              ❌ Rejected
            </span>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Seller Name:</strong> {order.seller_name}</p>
          <p><strong>Seller Email:</strong> {order.seller_email}</p>
          <p><strong>Company:</strong> {order.company_name}</p>
          <p><strong>Units:</strong> {order.units}</p>
          <p><strong>Revenue:</strong> ${order.revenue}</p>
          <p><strong>Delivery Date:</strong> {order.delivery_date || "N/A"}</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white border rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>

        <div className="space-y-3">
          {order.cart_items?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border border-gray-200 rounded p-3 bg-gray-50"
            >
              <img
                src={item.image_url || "/placeholder.png"}
                alt={item.product_name}
                className="w-14 h-14 rounded object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="custom-blue text-white px-8 py-3 rounded font-semibold"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}

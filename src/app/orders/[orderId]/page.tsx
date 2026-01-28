"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { Check, X } from "lucide-react";

/* ================= TYPES ================= */
type OrderRow = {
  id: string;
  order_number: number | null;
  status: "pending" | "approved" | "rejected";

  seller_name: string | null;
  seller_email: string | null;

  units: number | null;
  budget: number | null;
  revenue: number | null;
  ingram_account: string | null;
  quote: string | null;
  segment: string | null;
  manufacturer: string | null;
  is_reseller: boolean | null;

  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;

  delivery_date: string | null;
  notes: string | null;

  cart_items: any[];
  created_at: string;
};

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams() as { orderId: string };

  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState<OrderRow | null>(null);

  /* ================= AUTH CHECK (UNCHANGED) ================= */
  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      if (!profile || !["admin", "program_manager"].includes(profile.role)) {
        router.replace("/");
        return;
      }

      setAuthLoading(false);
    };

    checkAccess();
  }, [router]);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!error && data) {
      setOrder(data as OrderRow);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (newStatus: "approved" | "rejected") => {
  if (!order) return;

  setUpdating(true);

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", order.id);

  setUpdating(false);

  if (error) {
    console.error("STATUS UPDATE ERROR:", error);
    alert(error.message);
    return;
  }

  router.push("/orders");
};


  if (authLoading || loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  const statusColor =
    order.status === "approved"
      ? "bg-green-100 text-green-700"
      : order.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* ===== TOP SECTION ===== */}
      <div className="bg-white border rounded shadow">
        <div className="custom-blue text-white px-4 py-2 flex justify-between items-center">
          <span className="font-semibold">
            Order #{order.order_number ?? "-"}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {order.status.toUpperCase()}
          </span>
        </div>

        <div className="p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Created: {new Date(order.created_at).toLocaleString()}
          </span>

          {order.status === "pending" && (
            <div className="flex gap-2">
              <button
                disabled={updating}
                onClick={() => updateStatus("approved")}
                className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Check size={16} />
                Approve
              </button>

              <button
                disabled={updating}
                onClick={() => updateStatus("rejected")}
                className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== DETAILS (READ ONLY, SAME AS CHECKOUT) ===== */}
      <DetailSection title="Team Details">
        <Field label="Seller Name" value={order.seller_name} />
        <Field label="Seller Email" value={order.seller_email} />
      </DetailSection>

      <DetailSection title="Opportunity Details">
        <Field label="Units" value={order.units} />
        <Field label="Budget" value={order.budget} />
        <Field label="Revenue" value={order.revenue} />
        <Field label="Ingram Account" value={order.ingram_account} />
        <Field label="Quote" value={order.quote} />
        <Field label="Segment" value={order.segment} />
        <Field label="Manufacturer" value={order.manufacturer} />
        <Field label="Is Reseller" value={order.is_reseller ? "Yes" : "No"} />
      </DetailSection>

      <DetailSection title="Shipping Details">
        <Field label="Company" value={order.company_name} />
        <Field label="Contact Name" value={order.contact_name} />
        <Field label="Contact Email" value={order.contact_email} />
        <Field label="Address" value={order.address} />
        <Field label="City" value={order.city} />
        <Field label="State" value={order.state} />
        <Field label="Zip" value={order.zip} />
        <Field label="Delivery Date" value={order.delivery_date} />
        <Field label="Notes" value={order.notes} />
      </DetailSection>

      {/* ===== ITEMS ===== */}
      <div className="bg-white border rounded shadow p-4">
        <h3 className="font-semibold mb-3">Order Items</h3>

        {order.cart_items?.length ? (
          order.cart_items.map((item: any, i: number) => (
            <div key={i} className="flex gap-3 p-3 border rounded mb-2 bg-gray-50">
              <img
                src={item.image_url || "/placeholder.png"}
                className="w-14 h-14 object-cover rounded"
              />
              <div>
                <div className="font-medium">{item.product_name}</div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items</p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push("/orders")}
          className="custom-blue text-white px-10 py-3 rounded"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL HELPERS ================= */
function DetailSection({ title, children }: any) {
  return (
    <div className="bg-white border rounded shadow">
      <div className="custom-blue text-white px-4 py-2 font-semibold">
        {title}
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        disabled
        value={value ?? ""}
        className="w-full border p-2 rounded bg-gray-100"
      />
    </div>
  );
}

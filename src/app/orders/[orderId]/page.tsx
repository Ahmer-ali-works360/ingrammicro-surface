"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Layers,
  DollarSign,
  TrendingUp,
  Tag,
  Truck,
  Factory,
  Package,
  FileText,
} from "lucide-react";

/* ================= TYPES ================= */
type OrderStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "shipped"
    | "return"
    | "shipped_extension";

type OrderRow = {
    id: string;
    order_number: number | null;
    status: OrderStatus;

    seller_name: string | null;
    seller_email: string | null;

    approved_by?: string | null;
    approved_at?: string | null;

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

    tracking_file?: string | null;
};



export default function AdminOrderDetailPage() {
    const router = useRouter();
    const { orderId } = useParams() as { orderId: string };

    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    const [order, setOrder] = useState<OrderRow | null>(null);
    const [status, setStatus] = useState<OrderStatus>("pending");

    /* ================= AUTH ================= */
    useEffect(() => {
        const run = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) return router.replace("/login");

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.session.user.id)
                .single();

            if (!profile || !["admin", "program_manager"].includes(profile.role)) {
                return router.replace("/");
            }

            setAuthLoading(false);
        };
        run();
    }, [router]);

    /* ================= FETCH ================= */
    useEffect(() => {
        if (!orderId || authLoading) return;

        const fetchOrder = async () => {
            setLoading(true);
            const res = await fetch(`/api/admin-orders/${orderId}`);
            const json = await res.json();

            if (res.ok) {
                setOrder(json.order);
                setStatus(json.order.status);
            }

            setLoading(false);
        };

        fetchOrder();
    }, [orderId, authLoading]);

    /* ================= UPDATE STATUS ================= */
    const updateStatus = async () => {
        if (!order) return;

        setUpdating(true);

        try {
            // get current logged-in user
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError || !sessionData.session) {
                throw new Error("User session not found");
            }

            const userEmail = sessionData.session.user.email;
            const now = new Date().toISOString(); // 👈 ADDED

            // update order
            const { error } = await supabase
                .from("orders")
                .update({
                    status: status,
                    approved_by: userEmail,
                    approved_at: now, // 👈 ADDED
                })
                .eq("id", order.id);

            if (error) {
                throw error;
            }

            // update local state so UI reflects instantly
            setOrder({
                ...order,
                status: status,
                approved_by: userEmail,
                approved_at: now, // 👈 ADDED
            });

            console.log("✅ Order status updated by:", userEmail);

            // optional: redirect
            router.push("/orders");
        } catch (err: any) {
            console.error("❌ Status update failed:", err);
            alert(err.message || "Status update failed");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case "approved":
                return "Approved on";
            case "shipped":
                return "Shipped on";
            case "return":
                return "Returned on";
            case "shipped_extension":
                return "Shipped Extension on";
            default:
                return "Updated on";
        }
    };

    /* ================= TRACKING UPLOAD ================= */
    const uploadTrackingFile = async (file: File) => {
        if (!order) return;

        setUploadingFile(true);

        const path = `tracking/${order.id}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from("order-files")
            .upload(path, file, { upsert: true });

        if (uploadError) {
            alert(uploadError.message);
            setUploadingFile(false);
            return;
        }

        const { data } = supabase.storage
            .from("order-files")
            .getPublicUrl(path);

        await supabase
            .from("orders")
            .update({ tracking_file: data.publicUrl })
            .eq("id", order.id);

        setOrder({ ...order, tracking_file: data.publicUrl });
        setUploadingFile(false);
    };

    if (authLoading || loading) {
        return <div className="p-12 text-center text-gray-500">Loading…</div>;
    }

    if (!order) {
        return <div className="p-12 text-center">Order not found</div>;
    }

    /* ================= UI ================= */
    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 space-y-6">

{/* ================= TOP HEADER ================= */}
<div className="bg-white border border-gray-200 rounded-lg shadow">

  {/* ===== TOP ROW ===== */}
  <div className="px-6 py-4 flex items-start justify-between">
    {/* LEFT */}
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">
          Order #{order.order_number}
        </h1>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          {status.toUpperCase()}
        </span>
      </div>

      <div className="mt-1 text-xs text-gray-500">
        Order placed on{" "}
        {new Date(order.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
          timeZoneName: "short",
        })}
      </div>
    </div>

    {/* RIGHT */}
    <div className="flex flex-col items-end gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="border border-gray-300 text-sm px-3 py-1.5 bg-white"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="shipped">Shipped</option>
        <option value="return">Return</option>
        <option value="shipped_extension">Shipped Extension</option>
      </select>

      <button
        onClick={updateStatus}
        disabled={updating || status === order.status}
        className="
          mt-2
          text-xs font-medium
          px-4 py-2
          text-white
          custom-blue
          disabled:cursor-not-allowed
          transition
          cursor-pointer
          rounded-xl shadow
        "
      >
        {updating ? "Updating status…" : "Save Status"}
      </button>
    </div>
  </div>

  {/* ===== BOTTOM ROW (APPROVAL INFO) ===== */}
  <div className="border-t border-gray-200 px-6 py-3 grid grid-cols-2 gap-6">
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
        Approved by
      </p>
      <p className="text-sm text-gray-800">
        {order.approved_by || "—"}
      </p>
    </div>

    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
        {getStatusLabel(status)}
      </p>
      <p className="text-sm text-gray-800">
        {order.approved_at
          ? new Date(order.approved_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
              timeZoneName: "short",
            })
          : "—"}
      </p>
    </div>
  </div>

</div>




                {/* ================= TEAM DETAILS ================= */}
                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <div className="px-6 py-3 text-sm font-medium border-b">
                        Team Details
                    </div>
                    <div className="grid grid-cols-4 gap-6 px-6 py-4 text-sm">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Account Manager</p>
                            <p>{order.seller_name || "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Account Manager Email</p>
                            <p>{order.seller_email || "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Sales Manager</p>
                            <p>Michael Swartz</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Sales Manager Email</p>
                            <p>michsw@cdwg.com</p>
                        </div>
                    </div>
                </div>

      
                {/* ================= CUSTOMER + OPPORTUNITY ================= */}
<div className="grid grid-cols-2 gap-6">

  {/* ================= CUSTOMER INFORMATION ================= */}
  <div className="bg-white border border-gray-200 rounded-lg shadow">
   <div className="px-6 py-6">
  <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
    <User size={26} className="text-blue-600" />
    Customer Information
  </p>
</div>

    <div className="px-6 py-4 space-y-4">
      <div>
       <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <Building2 size={12} className="text-blue-400"/>
  Company
</p>
        <p className="text-sm text-gray-900">
          {order.company_name || "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <User size={12} className="text-blue-400"/>
  Contact Name
</p>
        <p className="text-sm text-gray-900">
          {order.contact_name || "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <Mail size={12} className="text-blue-400"/>
  Contact Email
</p>
        <p className="text-sm text-blue-600">
          {order.contact_email || "—"}
        </p>
      </div>
    </div>
  </div>

  {/* ================= OPPORTUNITY DETAILS ================= */}
  <div className="bg-white border border-gray-200 rounded-lg shadow">
    <div className="px-6 py-6 ">
      <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
        <DollarSign size={26} className="text-blue-600"/>
        Opportunity Details
      </p>
    </div>

    <div className="px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <Layers size={12} className="text-blue-400"/>
  Units
</p>
        <p className="text-sm text-gray-900">
          {order.units ?? "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <DollarSign size={12} className="text-blue-400"/>
  Budget per Device
</p>
        <p className="text-sm text-gray-900">
          {order.budget ? `$${order.budget}` : "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <TrendingUp size={12} className="text-blue-400"/>
  Revenue Opportunity
</p>
        <p className="text-sm text-gray-900">
          {order.revenue ? `$${order.revenue}` : "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <Tag size={12} className="text-blue-400"/>
  Segment
</p>
        <p className="text-sm text-gray-900">
          {order.segment || "—"}
        </p>
      </div>

      <div>
<p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
  <Factory size={12} className="text-blue-400"/>
  Manufacturer
</p>
        <p className="text-sm text-gray-900">
          {order.manufacturer || "—"}
        </p>
      </div>
    </div>
  </div>

</div>


                {/* ================= SHIPPING DETAILS ================= */}
                <div className="bg-white border border-gray-200 rounded-lg shadow">
                     <div className="px-6 py-6">
  <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
    <Truck size={26} className="text-blue-600" />
    Shipping Details
  </p>
</div>
                    <div className="grid grid-cols-4 gap-6 px-6 py-4 text-sm">
                        <Info label="Address" value={order.address} />
                        <Info label="City" value={order.city} />
                        <Info label="State" value={order.state} />
                        <Info label="ZIP" value={order.zip} />
                    </div>
                </div>

                {/* ================= SHIPPING & TRACKING ================= */}
                <div className="bg-white border border-gray-200 px-6 py-5 rounded-lg shadow">
                    <div className="text-sm font-medium mb-4">
                        Shipping & Tracking
                    </div>

                    <div className="flex items-center gap-6">
                        <TimelineDot active label="Confirmed" />
                        <div className="flex-1 h-px bg-green-500" />
                        <TimelineDot active={order.status === "shipped"} label="Shipped" />
                        <div className="flex-1 h-px bg-gray-300" />
                        <TimelineDot active={order.status === "return"} label="Returned" />
                    </div>

                    {order.tracking_file && (
                        <div className="mt-4 text-sm">
                            Tracking #{" "}
                            <a
                                href={order.tracking_file}
                                className="text-blue-600 underline"
                                target="_blank"
                            >
                                View PDF
                            </a>
                        </div>
                    )}
                </div>

                {/* ================= ORDER ITEMS ================= */}
                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    {/* <div className="px-6 py-3 text-sm font-medium border-b">
                        Order Items ({order.cart_items.length})
                    </div> */}
                                    <div className="px-6 py-6">
  <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
    <Package size={26} className="text-blue-600" />
    Order Items
  </p>
</div>

                    <div className="divide-y">
                        {order.cart_items.map((item: any, i: number) => (
                            <div key={i} className="px-6 py-4 text-sm">
                                <p className="text-blue-600 font-medium">
                                    {item.product_name}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    {item.sku}
                                </p>

                                <div className="grid grid-cols-4 gap-4 text-xs">
                                    <span>Brand: {item.brand}</span>
                                    <span>Processor: {item.processor}</span>
                                    <span>Memory: {item.memory}</span>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= NOTES ================= */}
                {order.notes && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow">
                        
                        <div className="px-6 py-6">
  <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
    <FileText size={26} className="text-blue-600" />
    Additional Notes
  </p>
</div>
                        <div className="px-6 py-4 text-sm">
                            {order.notes}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}

function TimelineDot({ active, label }: any) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-4 h-4 rounded-full ${active ? "bg-green-500" : "bg-gray-300"
                    }`}
            />
            <p className="text-xs mt-1">{label}</p>
        </div>
    );
}


/* ================= HELPERS ================= */


function Info({ label, value }: any) {
    return (
        <div>
            <p className="text-xs uppercase text-gray-400 mb-1">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

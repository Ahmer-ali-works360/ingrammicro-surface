"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package, DollarSign, Layers, Calendar } from "lucide-react";

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

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Shipped", value: "shipped" },
    { label: "Return", value: "return" },
    { label: "Shipped Extension", value: "shipped_extension" },
];

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
        if (!order) {
            console.log("❌ No order found");
            return;
        }

        console.log("🚀 Update Status Clicked");
        console.log("📦 Order ID:", order.id);
        console.log("🔄 Old Status:", order.status);
        console.log("🆕 New Status:", status);

        setUpdating(true);

        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", order.id)
            // .select(); // 👈 IMPORTANT for debugging

        console.log("📡 Supabase response data:", data);
        console.log("⚠️ Supabase error:", error);

        setUpdating(false);

        if (error) {
            alert("Update failed: " + error.message);
            return;
        }

        console.log("✅ Status updated successfully");

        router.push("/orders");
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
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* ===== TOP GRID ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
                        <CardHeader title="Order Details" />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <Info label="Order No" value={order.order_number} />
                            <Info
                                label="Created At"
                                value={new Date(order.created_at).toLocaleString()}
                            />
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl overflow-hidden">
                        <CardHeader title="Order Status" />
                        <div className="p-6">
                            <select
                                value={status}
                                onChange={(e) => {
                                    console.log("⬇️ Status changed to:", e.target.value);
                                    setStatus(e.target.value as OrderStatus);
                                }}
                                className="border rounded px-3 py-2 w-full mb-3"
                            >

                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => {
                                    console.log("🖱 Button clicked");
                                    console.log("Updating:", updating);
                                    console.log("Selected status:", status);
                                    console.log("Original status:", order.status);
                                    updateStatus();
                                }}
                                disabled={updating || status === order.status}
                                className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== SUMMARY + TRACKING ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
                        <CardHeader title="Order Summary" />
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Summary label="Units" value={order.units} icon={Layers} />
                            <Summary label="Items" value={order.cart_items.length} icon={Package} />
                            <Summary label="Budget" value={`$${order.budget}`} icon={DollarSign} />
                            <Summary label="Revenue" value={`$${order.revenue}`} icon={DollarSign} />
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl overflow-hidden">
                        <CardHeader title="Order Tracking" />
                        <div className="p-6">
                            {order.tracking_file && (
                                <a
                                    href={order.tracking_file}
                                    target="_blank"
                                    className="block text-sm text-blue-600 underline mb-3"
                                >
                                    View Tracking PDF
                                </a>
                            )}

                            <label className="inline-block cursor-pointer border px-4 py-2 rounded text-sm hover:bg-gray-50">
                                {uploadingFile ? "Uploading…" : "Upload Tracking PDF"}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files && uploadTrackingFile(e.target.files[0])
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Reseller Details">
                            <Read label="Seller Name" value={order.seller_name} />
                            <Read label="Seller Email" value={order.seller_email} />
                        </Section>

                        <Section title="Opportunity">
                            <Read label="Units" value={order.units} />
                            <Read label="Budget" value={order.budget} />
                            <Read label="Revenue" value={order.revenue} />
                            <Read label="Ingram Account" value={order.ingram_account} />
                            <Read label="Quote" value={order.quote} />
                            <Read label="Segment" value={order.segment} />
                            <Read label="Manufacturer" value={order.manufacturer} />
                            <Read
                                label="Is Reseller"
                                value={order.is_reseller ? "Yes" : "No"}
                            />
                        </Section>
                    </div>

                    <div className="bg-white border rounded-xl overflow-hidden">
                        <CardHeader title="Items" />
                        <div className="p-6">
                            {order.cart_items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4 p-3 border rounded mb-3">
                                    <img
                                        src={item.image_url || "/placeholder.png"}
                                        className="w-14 h-14 rounded object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== BACK ===== */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-2 border px-5 py-2 rounded bg-white"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </button>
            </div>
        </div>
    );
}

/* ================= HELPERS ================= */

function CardHeader({ title }: { title: string }) {
    return (
        <div className="px-5 py-3 font-semibold bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 text-gray-700 border-b rounded-t-xl">
            {title}
        </div>
    );
}

function Section({ title, children }: any) {
    return (
        <div className="bg-white border rounded-xl overflow-hidden">
            <CardHeader title={title} />
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function Read({ label, value }: any) {
    return (
        <div>
            <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
            <div className="bg-gray-50 border rounded px-3 py-2 text-sm">
                {value || "-"}
            </div>
        </div>
    );
}

function Info({ label, value }: any) {
    return (
        <div>
            <p className="text-xs uppercase text-gray-400 mb-1">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

function Summary({ icon: Icon, label, value }: any) {
    return (
        <div className="border rounded-lg p-4 flex items-center gap-3">
            <Icon size={20} className="text-gray-400" />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-semibold">{value ?? "-"}</p>
            </div>
        </div>
    );
}

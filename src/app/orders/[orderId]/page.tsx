//src/app/orders/[orderId]/page.tsx 


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { useAuthRole } from "@/app/context/AuthContext";
import {
  Building2,
  MapPin,
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
  Users,
  Pencil,
  ArrowLeft,
  Eye,
  EyeOff,
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
  tracking_number?: string | null;
  tracking_link?: string | null;
  return_tracking_number?: string | null;
  return_tracking_link?: string | null;
  case_type?: string | null;
  tracking_username?: string | null;
  tracking_password?: string | null;
  return_label?: string | null;


};

/* ================= calculation ================= */
const calculateRevenue = (units?: number | null, budget?: number | null) => {
  if (!units || !budget) return null;
  return units * budget;
};



export default function AdminOrderDetailPage({
  isEdit = false,
}: {
  isEdit?: boolean;
}) {

  const [form, setForm] = useState<any>({});
  const router = useRouter();
  const { orderId } = useParams() as { orderId: string };



  const [uploadingFile, setUploadingFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemQty, setItemQty] = useState<number>(0);


  const [order, setOrder] = useState<OrderRow | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const getTimelineStep = (status: OrderStatus) => {
    switch (status) {
      case "approved":
        return 0; // Approved
      case "shipped":
      case "shipped_extension":
        return 1; // Shipped
      case "return":
        return 2; // Returned
      default:
        return -1;
    }
  };


  useEffect(() => {
    console.log("RETURN LABEL DEBUG 👉", order?.return_label);
  }, [order]);



  const currentStep = order ? getTimelineStep(order.status) : 0;

  /* ================= AUTH ================= */

  const { loading: authLoading, isAllowed, role, } = useAuthRole([
    "admin",
    "program_manager",
    "shop_manager",
  ]);

  const normalizedRole = role?.toLowerCase();

  const isAdmin = normalizedRole === "admin";
  const isShopManager = normalizedRole === "shop_manager";
  const isProgramManager = normalizedRole === "program_manager";

  const isShopManagerEdit = isEdit && isShopManager;

  const canEditFull = isEdit && isAdmin;
  const canEditLimited = isEdit && isShopManager;

  const isPending = (order?.status ?? status) === "pending";

  // program manager sirf pending pe ek dafa action
  const canPMAct =
    isProgramManager &&
    isPending &&
    !authLoading;

  useEffect(() => {
    if (!authLoading && !isAllowed) {
      router.replace("/login"); // ya /unauthorized
    }
  }, [authLoading, isAllowed, router]);




  /* ================= FETCH ================= */
  useEffect(() => {
    if (!orderId || authLoading || !isAllowed) return;

    const fetchOrder = async () => {
      setLoading(true);
      const res = await fetch(`/api/admin-orders/${orderId}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (res.ok) {
        setOrder(json.order);
        setStatus(json.order.status);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId, authLoading]);

  /* ================= UPDATE order ================= */
  useEffect(() => {
    if (!order) return;
    if (!isEdit) return;

    // ⛔ agar form already filled hai, dobara mat bharo
    if (Object.keys(form).length > 0) return;

    setForm({
      company_name: order.company_name,
      contact_name: order.contact_name,
      contact_email: order.contact_email,
      units: order.units,
      budget: order.budget,
      revenue: order.revenue,
      segment: order.segment,
      manufacturer: order.manufacturer,
      address: order.address,
      city: order.city,
      state: order.state,
      zip: order.zip,
      notes: order.notes,

      tracking_number: order.tracking_number ?? "",
      tracking_link: order.tracking_link ?? "",
      return_tracking_number: order.return_tracking_number ?? "",
      return_tracking_link: order.return_tracking_link ?? "",
      case_type: order.case_type ?? "",
      tracking_username: order.tracking_username ?? "",
      tracking_password: order.tracking_password ?? "",
      return_label: order.return_label ?? null,
    });
  }, [order, isEdit]);


  /* ================= SYNC RETURN LABEL FILE NAME ================= */
  useEffect(() => {
    if (order?.return_label) {
      const name = order.return_label.split("/").pop();
      setUploadedFileName(name || null);
    }
  }, [order]);

  const SEGMENTS = [
    "Corporate West",
    "Corporate Central",
    "Corporate East",
    "K-12",
    "Hi-Ed",
    "Healthcare",
    "CoreTrust",
  ]

  const MANUFACTURERS = [
    "Dell",
    "HP",
    "Lenovo",
    "Apple",
    "Microsoft",
    "Panasonic",
    "Samsung",
  ]




  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (nextStatus?: OrderStatus) => {
    if (!order) return;

    const finalStatus = nextStatus ?? status;

    // PM guard (sirf UX ke liye)
    if (isProgramManager) {
      if (!isPending) return;
      if (finalStatus !== "approved" && finalStatus !== "rejected") return;
    }

    setUpdating(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          status: finalStatus,
          role,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Status update failed");
      }

      if (isAdmin || isShopManager) {
        console.log("Admin/ShopManager sending email for:", finalStatus);
        await sendStatusEmails(finalStatus);
      }

      const refreshed = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
      });
      const refreshedJson = await refreshed.json();

      setOrder(refreshedJson.order);
      setStatus(refreshedJson.order.status);

    } catch (err: any) {
      console.error("❌ Status update failed:", err);
      alert(err.message);
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
  /* ================= edit order page data ================= */
  const saveOrder = async () => {
    if (!order) return;

    setUpdating(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      // 🛡️ return_label ko overwrite hone se bachao
      const safeForm = { ...form };

      const res = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          data: {
            ...safeForm,
            revenue: calculateRevenue(safeForm.units, safeForm.budget),
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Order update failed");
      }

      const refreshed = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
      });
      const refreshedJson = await refreshed.json();
      setOrder(refreshedJson.order);

      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };



  /* ================= Edit order item(quantity) ================= */

  const startEditItem = (item: any, index: number) => {
    setEditingItemIndex(index);
    setItemQty(item.quantity);
  };

  const saveItemQuantity = async (index: number) => {
    if (!order) return;

    const item = order.cart_items[index];
    const oldQty = item.quantity;
    const newQty = itemQty;

    if (oldQty === newQty) {
      setEditingItemIndex(null);
      return;
    }

    const diff = newQty - oldQty;

    // product fetch
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (productError || !product) {
      alert("Product not found");
      return;
    }

    // stock check (only when increasing qty)
    if (diff > 0 && product.stock_quantity < diff) {
      alert("Not enough stock available");
      return;
    }

    // update product stock
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock_quantity: product.stock_quantity - diff,
      })
      .eq("id", item.product_id);

    if (stockError) {
      alert("Failed to update product stock");
      return;
    }

    // update order cart_items
    const updatedItems = [...order.cart_items];
    updatedItems[index] = {
      ...item,
      quantity: newQty,
    };

    const { error: orderError } = await supabase
      .from("orders")
      .update({ cart_items: updatedItems })
      .eq("id", order.id);

    if (orderError) {
      alert("Failed to update order item");
      return;
    }

    setOrder({ ...order, cart_items: updatedItems });
    setEditingItemIndex(null);
  };

  const deleteItem = async (index: number) => {
    if (!order) return;

    const item = order.cart_items[index];

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (productError || !product) {
      alert("Product not found");
      return;
    }

    // restore stock
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock_quantity: product.stock_quantity + item.quantity,
      })
      .eq("id", item.product_id);

    if (stockError) {
      alert("Failed to restore product stock");
      return;
    }

    const updatedItems = order.cart_items.filter(
      (_: any, i: number) => i !== index
    );

    const { error: orderError } = await supabase
      .from("orders")
      .update({ cart_items: updatedItems })
      .eq("id", order.id);

    if (orderError) {
      alert("Failed to delete item");
      return;
    }

    setOrder({ ...order, cart_items: updatedItems });
  };


  useEffect(() => {
    console.log("ROLE DEBUG 👉", { role, isAdmin, isShopManager, isProgramManager });
  }, [role]);

  const uploadReturnLabel = async (file: File) => {
    if (!order) return;

    const path = `return-labels/${order.id}-${Date.now()}-${file.name}`;
    setUploadingFile(true);

    try {
      const { error } = await supabase.storage
        .from("order-files")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from("order-files")
        .getPublicUrl(path);


      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      const res = await fetch(`/api/admin-orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          data: {
            return_label: data.publicUrl,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save return label");
      }


      // ✅ VERY IMPORTANT: API se fresh data lao
      const refreshed = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
      });
      const refreshedJson = await refreshed.json();
      setOrder(refreshedJson.order);

      setUploadedFileName(file.name);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploadingFile(false);
    }
  };


  const removeReturnLabel = async () => {
    if (!order) return;

    setUploadingFile(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const res = await fetch(`/api/admin-orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        data: {
          return_label: null,
        },
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to remove return label");
    }


    // 🔁 REFRESH
    const refreshed = await fetch(`/api/admin-orders/${order.id}`, {
      cache: "no-store",
    });
    const refreshedJson = await refreshed.json();
    setOrder(refreshedJson.order);

    setUploadedFileName(null);
    setUploadingFile(false);
  };

  // ================= EMAIL SEND AFTER UPDATE STATUS FOR ADMIN/SM =================

  const sendStatusEmails = async (finalStatus: OrderStatus) => {
    if (!order) return;

    const emailData = {
      // Basic Order Info
      orderId: order.id,
      order_number: order.order_number,
      status: finalStatus,
      created_at: order.created_at,

      // Customer Info
      companyName: order.company_name,
      contactName: order.contact_name,
      contact_email: order.contact_email,

      // Seller/Team Info
      sellerEmail: order.seller_email,
      sellerName: order.seller_name,

      // Shipping Info
      shippingAddress: order.address,
      city: order.city,
      state: order.state,
      zip: order.zip,
      deliveryDate: order.delivery_date,

      // Opportunity Details
      units: order.units,
      budget: order.budget,
      revenue: order.revenue,
      ingramAccount: order.ingram_account,
      quote: order.quote,
      segment: order.segment,
      manufacturer: order.manufacturer,
      isReseller: order.is_reseller,

      // Tracking Information
      trackingNumber: order.tracking_number,
      trackingLink: order.tracking_link,
      returnTrackingNumber: order.return_tracking_number,
      returnTrackingLink: order.return_tracking_link,
      caseType: order.case_type,
      trackingUsername: order.tracking_username,
      // tracking_password: EXCLUDED (security)
      returnLabel: order.return_label,

      // Approval Info
      approvedBy: order.approved_by,
      approvedAt: order.approved_at || new Date().toISOString(),

      // Additional Notes
      notes: order.notes,

      // Order Items (complete details)
      orderItems: order.cart_items.map((item: any) => ({
        quantity: item.quantity,
        productName: item.product_name,
        sku: item.sku,
        brand: item.brand,
        processor: item.processor,
        memory: item.memory,
        // product_id: EXCLUDED (security)
      }))
    };

    console.log("Cart items being sent:", order.cart_items);

    let userType = "";
    let adminType = "";

    switch (finalStatus) {
      case "approved":
        userType = "ORDER_APPROVED_USER";
        adminType = "ORDER_APPROVED_ADMIN";
        break;

      case "rejected":
        userType = "ORDER_REJECTED_USER";
        adminType = "ORDER_REJECTED_ADMIN";
        break;

      case "shipped":
        userType = "ORDER_SHIPPED_USER";
        adminType = "ORDER_SHIPPED_ADMIN";
        break;

      case "return":
        userType = "ORDER_RETURN_USER";
        adminType = "ORDER_RETURN_ADMIN";
        break;

      default:
        return; // pending pe email nahi bhejni
    }

    // USER EMAIL
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: order.contact_email,
        type: userType,
        data: emailData,
      }),
    });

    // ADMIN EMAIL
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "ahmer.ali@works360.com",
        type: adminType,
        data: emailData,
      }),
    });
  };

  // ================= PM APPROVE/REJECT WITH EMAIL =================
  const updateStatusWithEmail = async (nextStatus: OrderStatus) => {
    if (!order) return;

    setUpdating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("User not authenticated");
      }

      // 1️⃣ Status update
      const res = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          status: nextStatus,
          role,
        }),
      });

      const statusUpdateResponse = await res.json();
      console.log("Response from status update API:", statusUpdateResponse);

      if (!res.ok) {
        throw new Error("Status update failed");
      }

      // ✅ Call shared email function
      console.log("Calling shared email sender for status:", nextStatus);
      await sendStatusEmails(nextStatus);

      // 2️⃣ Refresh order
      const refreshed = await fetch(`/api/admin-orders/${order.id}`, {
        cache: "no-store",
      });
      const refreshedJson = await refreshed.json();

      setOrder(refreshedJson.order);
      setStatus(refreshedJson.order.status);

      alert(`Order ${nextStatus} successfully! Emails sent.`);
    } catch (err: any) {
      console.error("❌ Error:", err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };



  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);



  if (authLoading || loading || !role) {
    return <div className="p-12 text-center text-gray-500">Loading…</div>;
  }

  if (!isAllowed) {
    return null;
  }

  if (!order) {
    return <div className="p-12 text-center">Order not found</div>;
  }


  // if (authLoading) return null;
  // if (!isAllowed) return null;
  /* ================= UI ================= */
  return (


    <div className="bg-gray-50 min-h-screen py-6">


      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* ================= BACK + EDIT BAR ================= */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>

          {!isEdit && (isAdmin || isShopManager) ? (
            <button
              onClick={() => router.push(`/orders/${order.id}/edit`)}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg"
            >
              <Pencil size={14} />
              Edit Order
            </button>
          ) : isEdit ? (
            <div className="flex gap-2">
              <button
                onClick={saveOrder}
                className="px-4 py-2 custom-blue text-white cursor-pointer rounded-lg"
              >
                Save Order
              </button>

              <button
                onClick={() => router.push(`/orders/${order.id}`)}
                className="px-4 py-2 border cursor-pointer rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : null}

        </div>



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

                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
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
            <div className="flex items-center gap-2">
              {(isAdmin || isShopManager) && (
                <>
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
                    onClick={() => setShowStatusModal(true)}
                    disabled={updating || status === order.status}
                    className="text-xs font-medium px-4 py-2 text-white custom-blue disabled:cursor-not-allowed transition cursor-pointer rounded-xl" >
                    {updating ? "Updating status…" : "Update Status"}
                  </button>
                </>
              )}

              {canPMAct && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatusWithEmail("approved")}
                    disabled={updating}
                    className="cursor-pointer
                            flex items-center gap-1.5
                            rounded-md px-3 py-1.5 text-xs font-medium
                            bg-green-600
                            text-white
                            hover:bg-green-800
                            disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatusWithEmail("rejected")}
                    disabled={updating}
                    className="cursor-pointer
                          flex items-center gap-1.5
                          rounded-md px-3 py-1.5 text-xs font-medium
                          border border-red-500
                          text-red-600
                          bg-transparent
                          hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600
                          hover:text-white
                          disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}


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
                Approved on
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


        {/* SHOP MANAGER EDIT MODE — TRACKING + ORDER ITEMS ON TOP */}
        {isShopManagerEdit && (
          <>
            {/* ================= TRACKING INFORMATION ================= */}
            <div className="bg-white border border-gray-200 rounded-lg shadow">
              <div className="px-6 py-6">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Truck size={26} className="text-blue-600" />
                  Tracking Information
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 px-6 py-4 text-sm">

                {/* Tracking Number */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Tracking Number</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_number || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_number: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.tracking_number || "—"}</p>
                  )}
                </div>

                {/* Tracking Link */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Tracking Link</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_link || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_link: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : order.tracking_link ? (
                    <a
                      href={order.tracking_link}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Open Link
                    </a>
                  ) : (
                    <p>—</p>
                  )}
                </div>

                {/* Return Tracking Number */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Return Tracking Number
                  </p>
                  {isEdit ? (
                    <input
                      value={form.return_tracking_number || ""}
                      onChange={(e) =>
                        setForm({ ...form, return_tracking_number: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.return_tracking_number || "—"}</p>
                  )}
                </div>

                {/* Return Tracking Link */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Return Tracking Link
                  </p>
                  {isEdit ? (
                    <input
                      value={form.return_tracking_link || ""}
                      onChange={(e) =>
                        setForm({ ...form, return_tracking_link: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : order.return_tracking_link ? (
                    <a
                      href={order.return_tracking_link}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Open Link
                    </a>
                  ) : (
                    <p>—</p>
                  )}
                </div>

                {/* Case Type */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Case Type</p>
                  {isEdit ? (
                    <input
                      value={form.case_type || ""}
                      onChange={(e) =>
                        setForm({ ...form, case_type: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.case_type || "—"}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Username</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_username || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_username: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.tracking_username || "—"}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Password</p>

                  {isEdit ? (
                    <div className="flex items-center border rounded w-full px-3 py-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.tracking_password || ""}
                        onChange={(e) =>
                          setForm({ ...form, tracking_password: e.target.value })
                        }
                        className="flex-1 outline-none text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-blue-600 ml-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  ) : (
                    <p>{order.tracking_password ? "••••••" : "—"}</p>
                  )}
                </div>




                {/* Return Label */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Return Label</p>

                  {/* Upload only in edit mode */}
                  {isEdit && (
                    <div className="space-y-1 mb-2">
                      <label className="flex items-center gap-3 border rounded px-3 py-2 cursor-pointer hover:border-blue-500 text-sm">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadReturnLabel(e.target.files[0]);
                            }
                          }}
                          disabled={uploadingFile}
                        />

                        <span className="px-3 py-1 text-xs custom-blue text-white rounded transition cursor-pointer">
                          {uploadingFile ? "Uploading..." : "Choose file"}
                        </span>

                        <span className="text-gray-500 text-xs truncate">
                          {uploadedFileName || "No file selected"}
                        </span>

                        {order.return_label && order.return_label.trim() !== "" && (
                          <button
                            type="button"
                            onClick={removeReturnLabel}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        )}
                      </label>
                    </div>
                  )}

                  {/* 👇 ALWAYS show view link if file exists */}
                  {order.return_label && order.return_label.trim() !== "" ? (
                    <a
                      href={order.return_label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Return Label
                    </a>
                  ) : (
                    <p className="text-sm">—</p>
                  )}
                </div>






              </div>
            </div>



            {/* ================= ORDER ITEMS ================= */}
            <div className="bg-white border border-gray-200 rounded-lg shadow mt-6">
              <div className="px-6 py-6">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Package size={26} className="text-blue-600" />
                  Order Items
                </p>
              </div>

              <div className="divide-y">
                {order.cart_items.map((item: any, i: number) => (
                  <div key={i} className="px-6 py-4 text-sm">

                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-medium">
                        {item.product_name}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditItem(item, i)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">
                      {item.sku}
                    </p>

                    <div className="grid grid-cols-4 gap-4 text-xs items-center">
                      <span>Brand: {item.brand}</span>
                      <span>Processor: {item.processor}</span>
                      <span>Memory: {item.memory}</span>

                      {editingItemIndex === i ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={itemQty}
                            onChange={(e) => setItemQty(Number(e.target.value))}
                            className="w-20 border px-2 py-1 text-xs rounded"
                          />
                          <button
                            onClick={() => saveItemQuantity(i)}
                            className="text-blue-600 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItemIndex(null)}
                            className="text-gray-500 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span>Qty: {item.quantity}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </>
        )}




        {/* ================= TEAM DETAILS ================= */}
        <div className="bg-white border border-gray-200 rounded-lg shadow">

          <div className="px-6 py-6">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Users size={26} className="text-blue-600" />
              Team Details
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 px-6 py-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Manager</p>
              <p>{order.seller_name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Manager Email</p>
              <p>{order.seller_email || "-"}</p>
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
                  {/* <Building2 size={12} className="text-blue-400" /> */}
                  Company
                </p>
                {canEditFull ? (
                  <input
                    value={form.company_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, company_name: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.company_name || "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <User size={12} className="text-blue-400" /> */}
                  Contact Name
                </p>
                {canEditFull ? (
                  <input
                    value={form.contact_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, contact_name: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="Contact name"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.contact_name || "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <Mail size={12} className="text-blue-400" /> */}
                  Contact Email
                </p>
                {canEditFull ? (
                  <input
                    type="email"
                    value={form.contact_email || ""}
                    onChange={(e) =>
                      setForm({ ...form, contact_email: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="Contact email"
                  />
                ) : (
                  <p className="text-sm text-blue-600">
                    {order.contact_email || "—"}
                  </p>
                )}

              </div>
            </div>
          </div>

          {/* ================= OPPORTUNITY DETAILS ================= */}
          <div className="bg-white border border-gray-200 rounded-lg shadow">
            <div className="px-6 py-6 ">
              <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <DollarSign size={26} className="text-blue-600" />
                Opportunity Details
              </p>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <Layers size={12} className="text-blue-400" /> */}
                  Units
                </p>
                {canEditFull ? (
                  <input
                    type="number"
                    value={form.units ?? ""}
                    onChange={(e) => {
                      const units =
                        e.target.value === "" ? null : Number(e.target.value);

                      setForm({
                        ...form,
                        units,
                        revenue: calculateRevenue(units, form.budget),
                      });
                    }}
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="Units"
                    min={0}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.units ?? "—"}
                  </p>
                )}


              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <DollarSign size={12} className="text-blue-400" /> */}
                  Budget per Device
                </p>
                {canEditFull ? (
                  <input
                    type="number"
                    value={form.budget ?? ""}
                    onChange={(e) => {
                      const budget =
                        e.target.value === "" ? null : Number(e.target.value);

                      setForm({
                        ...form,
                        budget,
                        revenue: calculateRevenue(form.units, budget),
                      });
                    }}
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="Budget"
                    min={0}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.budget ? `$${order.budget.toLocaleString("en-US")}` : "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <TrendingUp size={12} className="text-blue-400" /> */}
                  Revenue Opportunity
                </p>
                {canEditFull ? (
                  <input
                    value={form.revenue ?? ""}
                    disabled
                    className="border px-3 py-2 rounded w-full text-sm bg-gray-100"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.revenue ? `$${order.revenue.toLocaleString("en-US")}` : "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <Tag size={12} className="text-blue-400" /> */}
                  Segment
                </p>
                {canEditFull ? (
                  <select
                    value={form.segment || ""}
                    onChange={(e) =>
                      setForm({ ...form, segment: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                  >
                    <option value="">Select segment</option>
                    {SEGMENTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.segment || "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <Factory size={12} className="text-blue-400" /> */}
                  Manufacturer
                </p>
                {canEditFull ? (
                  <select
                    value={form.manufacturer || ""}
                    onChange={(e) =>
                      setForm({ ...form, manufacturer: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                  >
                    <option value="">Select manufacturer</option>
                    {MANUFACTURERS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.manufacturer || "—"}
                  </p>
                )}

              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  {/* <Factory size={12} className="text-blue-400" /> */}
                  Delivery Date
                </p>
                {canEditFull ? (
                  <input
                    type="date"
                    value={form.delivery_date || ""}
                    onChange={(e) =>
                      setForm({ ...form, delivery_date: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {order.delivery_date || "—"}
                  </p>
                )}


              </div>
            </div>
          </div>

        </div>



        {!isShopManagerEdit && (
          <>
            {/* ================= TRACKING INFORMATION ================= */}
            <div className="bg-white border border-gray-200 rounded-lg shadow">
              <div className="px-6 py-6">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Truck size={26} className="text-blue-600" />
                  Tracking Information
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 px-6 py-4 text-sm">

                {/* Tracking Number */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Tracking Number</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_number || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_number: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.tracking_number || "—"}</p>
                  )}
                </div>

                {/* Tracking Link */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Tracking Link</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_link || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_link: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : order.tracking_link ? (
                    <a
                      href={order.tracking_link}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Open Link
                    </a>
                  ) : (
                    <p>—</p>
                  )}
                </div>

                {/* Return Tracking Number */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Return Tracking Number
                  </p>
                  {isEdit ? (
                    <input
                      value={form.return_tracking_number || ""}
                      onChange={(e) =>
                        setForm({ ...form, return_tracking_number: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.return_tracking_number || "—"}</p>
                  )}
                </div>

                {/* Return Tracking Link */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Return Tracking Link
                  </p>
                  {isEdit ? (
                    <input
                      value={form.return_tracking_link || ""}
                      onChange={(e) =>
                        setForm({ ...form, return_tracking_link: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : order.return_tracking_link ? (
                    <a
                      href={order.return_tracking_link}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Open Link
                    </a>
                  ) : (
                    <p>—</p>
                  )}
                </div>

                {/* Case Type */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Case Type</p>
                  {isEdit ? (
                    <input
                      value={form.case_type || ""}
                      onChange={(e) =>
                        setForm({ ...form, case_type: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.case_type || "—"}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Username</p>
                  {isEdit ? (
                    <input
                      value={form.tracking_username || ""}
                      onChange={(e) =>
                        setForm({ ...form, tracking_username: e.target.value })
                      }
                      className="border px-3 py-2 rounded w-full text-sm"
                    />
                  ) : (
                    <p>{order.tracking_username || "—"}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Password</p>

                  {isEdit ? (
                    <div className="flex items-center border rounded w-full px-3 py-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.tracking_password || ""}
                        onChange={(e) =>
                          setForm({ ...form, tracking_password: e.target.value })
                        }
                        className="flex-1 outline-none text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-blue-600 ml-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  ) : (
                    <p>{order.tracking_password ? "••••••" : "—"}</p>
                  )}
                </div>




                {/* Return Label */}
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Return Label</p>

                  {/* Upload only in edit mode */}
                  {isEdit && (
                    <div className="space-y-1 mb-2">
                      <label className="flex items-center gap-3 border rounded px-3 py-2 cursor-pointer hover:border-blue-500 text-sm">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadReturnLabel(e.target.files[0]);
                            }
                          }}
                          disabled={uploadingFile}
                        />

                        <span className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
                          {uploadingFile ? "Uploading..." : "Choose file"}
                        </span>

                        <span className="text-gray-500 text-xs truncate">
                          {uploadedFileName || "No file selected"}
                        </span>

                        {order.return_label && order.return_label.trim() !== "" && (
                          <button
                            type="button"
                            onClick={removeReturnLabel}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        )}
                      </label>
                    </div>
                  )}

                  {/* 👇 ALWAYS show view link if file exists */}
                  {order.return_label && order.return_label.trim() !== "" ? (
                    <a
                      href={order.return_label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Return Label
                    </a>
                  ) : (
                    <p className="text-sm">—</p>
                  )}
                </div>






              </div>
            </div>
          </>
        )}




        {/* ================= SHIPPING DETAILS ================= */}
        <div className="bg-white border border-gray-200 rounded-lg shadow">
          <div className="px-6 py-6">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Truck size={26} className="text-blue-600" />
              Shipping Details
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 px-6 py-4 text-sm">

            {/* Address */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">Address</p>
              {canEditFull ? (
                <input
                  value={form.address || ""}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />
              ) : (
                <p className="font-medium">{order.address || "-"}</p>
              )}
            </div>

            {/* City */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">City</p>
              {canEditFull ? (
                <input
                  value={form.city || ""}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />
              ) : (
                <p className="font-medium">{order.city || "-"}</p>
              )}
            </div>

            {/* State */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">State</p>
              {canEditFull ? (
                <input
                  value={form.state || ""}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />
              ) : (
                <p className="font-medium">{order.state || "-"}</p>
              )}
            </div>

            {/* ZIP */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">ZIP</p>
              {canEditFull ? (
                <input
                  value={form.zip || ""}
                  onChange={(e) =>
                    setForm({ ...form, zip: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />
              ) : (
                <p className="font-medium">{order.zip || "-"}</p>
              )}
            </div>

          </div>
        </div>


        {/* ================= SHIPPING & TRACKING ================= */}
        <div className="bg-white border border-gray-200 rounded-lg shadow">
          <div className="px-6 py-6">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={26} className="text-blue-600" />
              Shipping & Tracking
            </p>
          </div>

          <div className="flex items-center px-6 py-6 gap-6">
            {/* Confirmed */}
            <TimelineDot active={currentStep >= 0} label="Approved" />

            <div
              className={`flex-1 h-px ${currentStep >= 1 ? "bg-blue-400" : "bg-gray-300"
                }`}
            />

            {/* Shipped */}
            <TimelineDot active={currentStep >= 1} label="Shipped" />

            <div
              className={`flex-1 h-px ${currentStep >= 2 ? "bg-blue-400" : "bg-gray-300"
                }`}
            />

            {/* Returned */}
            <TimelineDot active={currentStep >= 2} label="Returned" />
          </div>


        </div>

        {!isShopManagerEdit && (
          <>

            {/* ================= ORDER ITEMS ================= */}
            <div className="bg-white border border-gray-200 rounded-lg shadow">
              <div className="px-6 py-6">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Package size={26} className="text-blue-600" />
                  Order Items
                </p>
              </div>

              <div className="divide-y">
                {order.cart_items.map((item: any, i: number) => (
                  <div key={i} className="px-6 py-4 text-sm">

                    {/* Product name + actions */}
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-medium">
                        {item.product_name}
                      </p>

                      {isEdit && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditItem(item, i)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => deleteItem(i)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SKU */}
                    <p className="text-xs text-gray-500 mb-2">
                      {item.sku}
                    </p>

                    {/* Item details */}
                    <div className="grid grid-cols-4 gap-4 text-xs items-center">
                      <span>Brand: {item.brand}</span>
                      <span>Processor: {item.processor}</span>
                      <span>Memory: {item.memory}</span>

                      {/* Quantity (editable only) */}
                      {editingItemIndex === i ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={itemQty}
                            onChange={(e) => setItemQty(Number(e.target.value))}
                            className="w-20 border px-2 py-1 text-xs rounded"
                          />
                          <button
                            onClick={() => saveItemQuantity(i)}
                            className="text-blue-600 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItemIndex(null)}
                            className="text-gray-500 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span>Qty: {item.quantity}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}


        {/* ================= NOTES ================= */}
        <div className="bg-white border border-gray-200 rounded-lg shadow">
          <div className="px-6 py-6">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FileText size={26} className="text-blue-600" />
              Additional Notes
            </p>
          </div>

          <div className="px-6 py-4 text-sm">
            {canEditFull ? (
              <textarea
                value={form.notes || ""}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                rows={4}
                className="border px-3 py-2 rounded w-full text-sm resize-none"
                placeholder="Enter additional notes…"
              />
            ) : (
              <p>{order.notes || "-"}</p>
            )}
          </div>
        </div>

      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 text-center space-y-4">

            {!statusSuccess ? (
              <>
                <p className="text-lg font-semibold">
                  Are you sure you want to update status?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4  cursor-pointer py-2 border rounded"
                  >
                    No
                  </button>

                  <button
                    onClick={async () => {
                      await updateStatus();
                      setStatusSuccess(true);
                    }}
                    className="px-4 py-2 cursor-pointer custom-blue text-white rounded"
                  >
                    Yes
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  Order successfully updated!
                </p>

                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusSuccess(false);
                  }}
                  className="custom-blue px-4 py-2 cursor-pointer text-white rounded"
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );

}

function TimelineDot({ active, label }: any) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-4 h-4 rounded-full ${active ? "bg-blue-400" : "bg-gray-300"
          }`}
      />
      <p className="text-xs mt-1">{label}</p>
    </div>
  );
}





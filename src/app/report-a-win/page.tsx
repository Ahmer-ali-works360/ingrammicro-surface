"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";


export default function ReportAWinPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | number | null>(null);
  const [form, setForm] = useState({
    orderNumber: "",
    product_name: "",          // Device will be fetched here
    account: "",
    customerName: "",
    numberOfUnits: "",
    totalRevenue: "",
    oneTimePurchase: "",
    dateOfPurchase: "",
    description: "",
  });


  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherProduct, setOtherProduct] = useState("");

  const [reseller, setReseller] = useState("");
  const router = useRouter();


  // Fetch logged-in user email and orders for admin/PM
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
      router.replace("/login"); // 👈 apna login route
      return;
    }
      if (session?.user?.email) {
        setEmail(session.user.email);
        // ✅ FETCH RESELLER FROM PROFILE
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("reseller")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.log("Error fetching profile:", profileError);
        } else {
          setReseller(profile?.reseller || "");
        }

        const { data: winReports, error: winError } = await supabase
  .from("win_reports")
  .select("order_id");

if (winError) {
  console.log("Error fetching win reports:", winError);
}

const reportedOrderIds =
  winReports?.map((wr) => wr.order_id) || [];

        // Fetch all orders from the orders table
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) {
          console.log("Error fetching orders:", ordersError);
        } else {
          const filteredOrders = ordersData
  .filter(order => !reportedOrderIds.includes(order.id))
  .sort((a, b) =>
    Number(a.order_number) - Number(b.order_number)
  );

setOrders(filteredOrders);
        }
      }
    };
    fetchUserAndOrders();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrderSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const orderId = e.target.value;
    setSelectedOrder(orderId);

    if (!orderId) return;

    const { data: orderDetails, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.log("Error fetching order details:", error);
      return;
    }

    console.log("ORDER DETAILS 👉", orderDetails);

    const items = Array.isArray(orderDetails.cart_items)
      ? orderDetails.cart_items
      : [];

    setOrderItems(items);
    setIsOtherSelected(false);
    setOtherProduct("");

    const formattedProducts = items
      .map(
  (item: any, index: number) =>
    `${index + 1}. ${item.product_name} (Qty: ${item.quantity})`
)

      .join("\n");

    setForm(prev => ({
      ...prev,
      orderNumber: orderDetails.order_number,
      product_name: formattedProducts,
      account: orderDetails.ingram_account || "",
      customerName: orderDetails.contact_name || "",
      numberOfUnits: orderDetails.units || "",
      totalRevenue: orderDetails.revenue || "",
    }));
  };


  const productToSave = isOtherSelected
    ? otherProduct
    : form.product_name;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedOrder) {
    setModalMessage("Please select an order first.");
    setShowModal(true);
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    setModalMessage("Session expired. Please login again.");
    setShowModal(true);
    return;
  }

  if (isOtherSelected && !otherProduct.trim()) {
    setModalMessage("Please enter other device / SKU.");
    setShowModal(true);
    return;
  }

  try {
    const res = await fetch("/api/report-a-win", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: selectedOrder,
        user_id: session.user.id,
        product: productToSave,
        submitted_by: email,
        isOther: isOtherSelected,
        otherDesc: isOtherSelected ? otherProduct : null,
        reseller,
        resellerAccount: form.account,
        orderHash: form.orderNumber,
        customerName: form.customerName,
        units: form.numberOfUnits,
        revenue: form.totalRevenue,
        purchaseType: form.oneTimePurchase,
        purchaseDate: form.dateOfPurchase,
        notes: form.description,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setModalMessage(result.error || "Something went wrong.");
      setShowModal(true);
      return;
    }

 // USER EMAIL (fire & forget)
fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: email,
    type: "REPORT_A_WIN_USER",
    data: {
      reseller,
      resellerAccount: form.account,
      orderNumber: form.orderNumber,
      customerName: form.customerName,
      units: form.numberOfUnits,
      revenue: form.totalRevenue,
      purchaseType: form.oneTimePurchase,
      purchaseDate: form.dateOfPurchase,
      notes: form.description,
      product: productToSave,
      submittedBy: email,
    },
  }),
}).catch(err => console.error("User email error:", err));


// ADMIN EMAIL (fire & forget)
fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "ahmer.ali@works360.com",
    type: "REPORT_A_WIN_ADMIN",
    data: {
      order_id: selectedOrder,
        user_id: session.user.id,
        submittedBy: email,

        reseller,
        resellerAccount: form.account,

        orderNumber: form.orderNumber,
        product: productToSave,

        isOther: isOtherSelected,
        otherDesc: isOtherSelected ? otherProduct : null,

        customerName: form.customerName,
        units: form.numberOfUnits,
        revenue: form.totalRevenue,

        purchaseType: form.oneTimePurchase,
        purchaseDate: form.dateOfPurchase,

        notes: form.description,
    },
  }),
}).catch(err => console.error("Admin email error:", err));

    // ✅ SUCCESS
    setModalMessage("Win reported successfully! 🎉");
    setShowModal(true);

    setOrders(prev => prev.filter(o => o.id !== selectedOrder));
    setSelectedOrder("");
    setOrderItems([]);
    setIsOtherSelected(false);
    setOtherProduct("");

    setForm({
      orderNumber: "",
      product_name: "",
      account: "",
      customerName: "",
      numberOfUnits: "",
      totalRevenue: "",
      oneTimePurchase: "",
      dateOfPurchase: "",
      description: "",
    });

  } catch (err) {
    console.error("API Error:", err);
    setModalMessage("Server error. Please try again.");
    setShowModal(true);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Report a Win</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Submitted By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted By
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Order Number & Device (Same Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingram micro Surface Order #
              </label>
              <select
                value={selectedOrder || ""}
                onChange={handleOrderSelect}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Your Order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Device */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device(s) in this order
              </label>
              <div className="rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-700 min-h-30">

                {/* NO ORDER SELECTED */}
                {!selectedOrder && (
                  <div className="text-gray-400 italic">
                    Devices will appear here once you select an order
                  </div>
                )}

                {/* ORDER SELECTED */}
                {selectedOrder && (
                  <div className="space-y-2">

                    {/* ORDER DEVICES */}
                    {orderItems.map((item, index) => (
                      <div key={index}>
                        {index + 1}. {item.product_name} (Qty: {item.quantity})
                      </div>
                    ))}

                    {/* OTHER DEVICE */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="otherDevice"
                        checked={isOtherSelected}
                        onChange={() => setIsOtherSelected(true)}
                      />
                      <span>Other device</span>
                    </label>

                    {isOtherSelected && (
                      <input
                        type="text"
                        placeholder="Enter other device / SKU"
                        value={otherProduct}
                        onChange={(e) => setOtherProduct(e.target.value)}
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Rest of the form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <input
                type="text"
                name="account"
                value={form.account}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Number of Units */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
              <input
                type="number"
                name="numberOfUnits"
                value={form.numberOfUnits}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
              <input
                type="text"
                name="totalRevenue"
                value={form.totalRevenue}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* One-Time Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is this a one-time purchase or roll-out?
              </label>
              <select
                name="oneTimePurchase"
                value={form.oneTimePurchase}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="one-time">One-Time</option>
                <option value="roll-out">Roll-Out</option>
              </select>
            </div>

            {/* Date of Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Purchase</label>
              <input
                type="date"
                name="dateOfPurchase"
                value={form.dateOfPurchase}
                onChange={handleChange}
                 required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How did Ingrammicro Surface help you close this deal?
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-center">
  <button
    type="submit"
    className="custom-blue w-36 py-3 px-8  rounded-lg cursor-pointer text-white text-sm font-medium transition"
  >
    Submit
  </button>
</div>
        </form>
      </div>

      {/* Modal message */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Success
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              {modalMessage}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

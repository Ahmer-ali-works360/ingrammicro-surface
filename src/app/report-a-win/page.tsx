"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReportAWinPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState({
    orderNumber: "",
    device: "",          // Device will be fetched here
    account: "",
    customerName: "",
    numberOfUnits: "",
    totalRevenue: "",
    oneTimePurchase: "",
    dateOfPurchase: "",
    description: "",
  });

  // Fetch logged-in user email and orders for admin/PM
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error fetching session:", error);
      } else if (session?.user?.email) {
        setEmail(session.user.email);

        // Fetch all orders from the orders table
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) {
          console.log("Error fetching orders:", ordersError);
        } else {
          setOrders(ordersData);
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

  const handleOrderSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    setSelectedOrder(orderId);

    // Fetch order details based on selected order ID
    if (orderId) {
      const { data: orderDetails, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.log("Error fetching order details:", error);
      } else {
        // Set form state with fetched order details
        setForm({
          ...form,
          orderNumber: orderDetails.order_number,  // Map to the correct column
          device: orderDetails.device || "",  // Populate device correctly
          account: orderDetails.ingram_account || "",  // Map to 'ingram_account'
          customerName: orderDetails.contact_name || "",  // Map to 'contact_name'
          numberOfUnits: orderDetails.units || "",  // Map to 'units'
          totalRevenue: orderDetails.revenue || "",  // Map to 'revenue'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert form data into win_reports table
    const { data, error } = await supabase
      .from('win_reports')
      .insert([
        {
          order_number: form.orderNumber,
          device: form.device,
          account: form.account,
          customer_name: form.customerName,
          number_of_units: form.numberOfUnits,
          total_revenue: form.totalRevenue,
          one_time_purchase: form.oneTimePurchase,
          date_of_purchase: form.dateOfPurchase,
          description: form.description,
          submitted_by: email,
        },
      ]);

    if (error) {
      console.log("Error inserting into win_reports:", error);
    } else {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8">
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
                Ingrammicro Surface Order #
              </label>
              <select
                name="orderNumber"
                value={form.orderNumber}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device
              </label>
              <textarea
                name="device"
                value={form.device}  // Ensure device is populated from fetched order data
                onChange={handleChange}
                placeholder="Device details"
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          <div className="pt-4">
            <button
              type="submit"
              className="w-sm rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

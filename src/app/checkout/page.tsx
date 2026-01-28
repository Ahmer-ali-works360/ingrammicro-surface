"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type CheckoutForm = {
  sellerName: string;
  sellerEmail: string;
  units: string;
  budget: number;
  revenue: string;
  ingramAccount: string;
  quote: string;
  segment: string;
  manufacturer: string;
  isReseller: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliveryDate: string;
  notes: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalQuantity, clearCart } = useCart();

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<string>("");

  const [form, setForm] = useState<CheckoutForm>({
    sellerName: "",
    sellerEmail: "",
    units: "",
    budget: 1800,
    revenue: "",
    ingramAccount: "",
    quote: "",
    segment: "",
    manufacturer: "",
    isReseller: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    deliveryDate: "",
    notes: ""
  });

  // ---------------- AUTH GUARD ----------------
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login?redirect=/checkout");
      } else {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // ---------------- USER EMAIL (TS SAFE) ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;

      const user = data?.user;
      if (!user) return;

      setForm(prev => ({
        ...prev,
        sellerEmail: user.email ?? "",
      }));
    };

    fetchUser();
  }, []);

  // ---------------- CART GUARD ----------------
  useEffect(() => {
    if (successModal) return;

    if (cartItems.length === 0) {
      setErrorModal("Your cart is empty. Please add product(s) first.");
    } else if (totalQuantity > 3) {
      setErrorModal("Cart limit exceeded. Maximum 3 total items allowed.");
    } else {
      setErrorModal("");
    }
  }, [cartItems, totalQuantity, successModal]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "units") {
      const units = Number(value) || 0;
      setForm(prev => ({
        ...prev,
        units: value,
        revenue: (units * 1800).toString()
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (!user) return;

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        seller_name: form.sellerName,
        seller_email: form.sellerEmail,
        units: Number(form.units),
        budget: form.budget,
        revenue: Number(form.revenue),
        ingram_account: form.ingramAccount,
        quote: form.quote,
        segment: form.segment,
        manufacturer: form.manufacturer,
        is_reseller: form.isReseller === "yes",
        company_name: form.companyName,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        delivery_date: form.deliveryDate || null,
        notes: form.notes,
        cart_items: cartItems,
        status: "pending"
      },
    ]);

    if (error) {
      setErrorModal("Something went wrong while placing order.");
      return;
    }

    setSuccessModal(true); // ✅ cart yahan clear nahi ho raha
  };

  if (authLoading) return null;

  // ---------------- ERROR MODAL ----------------
  if (errorModal) {
    return (
      <Modal
        title="Attention"
        message={errorModal}
        buttonText="Go Back"
        onClose={() => router.back()}
      />
    );
  }

  // ---------------- SUCCESS MODAL ----------------
  if (successModal) {
    return (
      <Modal
        title="🎉 Order Placed!"
        message="Your order has been submitted successfully."
        buttonText="Continue"
        onClose={() => {
          clearCart();              // ✅ CART EMPTY HERE
          router.push("/thank-you");
        }}
      />
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Team Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Team Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Seller Contact Name *</label>
              <input
                name="sellerName"
                value={form.sellerName}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seller Contact Email *</label>
              <input
                name="sellerEmail"
                value={form.sellerEmail}
                disabled
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Opportunity Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">
                Device Opportunity Size (Units) *
              </label>
              <input
                type="number"
                name="units"
                value={form.units}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Budget Per Device ($)</label>
              <input
                name="budget"
                placeholder="$1800"
                value={form.budget}
                disabled
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Revenue Opportunity Size ($ Device Rev) *
              </label>
              <input
                name="revenue"
                value={form.revenue}
                readOnly
                className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Ingram Account # *</label>
              <input
                name="ingramAccount"
                value={form.ingramAccount}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Quote #</label>
              <input
                name="quote"
                value={form.quote}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Segment</label>
              <select
                name="segment"
                value={form.segment}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              >
                <option value="" disabled hidden>
                  Select Segment *
                </option>

                <option value="Corporate West">Corporate West</option>
                <option value="Corporate Central">Corporate Central</option>
                <option value="Corporate East">Corporate East</option>
                <option value="K-12">K-12</option>
                <option value="Hi-Ed">Hi-Ed</option>
                <option value="Healthcare">Healthcare</option>
                <option value="CoreTrust">CoreTrust</option>
              </select>

            </div>

            <div>
              <label className="block mb-1 font-medium">Current Manufacturer</label>
              <select
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Current Manufacturer</option>
                <option value="X">X</option>
                <option value="Y">Y</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Is this a reseller opportunity?
              </label>
              <select
                name="isReseller"
                value={form.isReseller}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Is this a competitive opportunity? *</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Shipping Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Customer Company Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Customer Company Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Name *</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Customer Contact Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Email *</label>
              <input
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="Customer Contact Email Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Shipping Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Customer Shipping Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">State *</option>
                <option value="CA">CA</option>
                <option value="TX">TX</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Zip *</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Zip *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

          </div>
        </div>

        {/* Order */}
        <div className="bg-white border rounded shadow p-4 border-gray-300">
          <div className="text-lg font-semibold mb-4">Your order</div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">No products in cart.</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border border-gray-200 rounded p-3 bg-gray-50"
                >
                  {/* Image */}
                  <div className="w-14 h-14 relative rounded overflow-hidden bg-white">
                    <img
                      src={item.image_url || "/placeholder.png"}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + qty */}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.product_name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="flex justify-center">
          <button className="min-w-xs custom-blue text-white py-4 rounded font-semibold">
            Place order
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------- MODAL COMPONENT ----------------
function Modal({
  title,
  message,
  buttonText,
  onClose,
}: {
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="bg-white rounded-lg p-6 z-60 w-11/12 max-w-md text-center">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
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
  estimatedCloseDate: string;
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
    estimatedCloseDate: "", 
    notes: ""
  });


  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));


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
    const cartItemsSnapshot = cartItems.map(item => ({
  product_id: item.id,
  product_name: item.product_name,
  sku: item.sku,
  brand: item.brand,
  processor: item.processor,
  memory: item.memory,
  quantity: item.quantity,
  image_url: item.image_url,
}));



    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (!user) return;

// ✅ Naya — API ke through
const orderRes = await fetch("/api/orders/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
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
    estimated_close_date: form.estimatedCloseDate || null,
    notes: form.notes,
    cart_items: cartItemsSnapshot,
  }),
});

const orderResult = await orderRes.json();

if (!orderRes.ok) {
  setErrorModal("Something went wrong while placing order.");
  return;
}

const orderData = orderResult.orderData;



// 🔻 UPDATE STOCK (AFTER ORDER INSERT)
const stockRes = await fetch("/api/orders/update-stock", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orderId: orderData.id,
    items: cartItemsSnapshot, // product_id + quantity yahin se jayegi
  }),
});

const stockResult = await stockRes.json();

if (!stockRes.ok) {
  setErrorModal(
    stockResult?.message || "Stock update failed. Please try again."
  );
  return;
}



    // 👇 YAHAN email Send hogi

 // 📧 EMAIL TO ADMIN (IMMEDIATE)
await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "ahmer.ali@works360.com",
    type: "ORDER_PLACED_ADMIN",
    data: {
      orderId: orderData.id,
      order_number: orderData.order_number,
      createdAt: new Date().toISOString(),
      
      // Team Details
      sellerName: form.sellerName,
      sellerEmail: form.sellerEmail,
      
      // Opportunity Details
      units: form.units,
      budget: form.budget,
      revenue: form.revenue,
      ingramAccount: form.ingramAccount,
      quote: form.quote,
      segment: form.segment,
      manufacturer: form.manufacturer,
      isReseller: form.isReseller,
      estimatedCloseDate: form.estimatedCloseDate,
      
      // Shipping Details
      companyName: form.companyName,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      shippingAddress: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      deliveryDate: form.deliveryDate,
      notes: form.notes,
      
      ordersPageUrl: "http://localhost:3000/orders",
      orderItems: cartItemsSnapshot.map(item => ({
        quantity: item.quantity,
        inventory: {
          product_names: item.product_name,
          skus: item.sku,
        }
      })),
    },
  })
});


// 📧 EMAIL TO USER (AFTER 15 SECONDS)
await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: form.sellerEmail,
    type: "ORDER_PLACED_USER",
    data: {
      orderId: orderData.id,
      order_number: orderData.order_number,
      createdAt: new Date().toISOString(),
      
      // Team Details
      name: form.sellerName,
      sellerEmail: form.sellerEmail,
      
      // Opportunity Details
      units: form.units,
      budget: form.budget,
      revenue: form.revenue,
      ingramAccount: form.ingramAccount,
      quote: form.quote,
      segment: form.segment,
      manufacturer: form.manufacturer,
      isReseller: form.isReseller,
      estimatedCloseDate: form.estimatedCloseDate,
      
      // Shipping Details
      companyName: form.companyName,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      shippingAddress: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      deliveryDate: form.deliveryDate,
      notes: form.notes,
      
      orderItems: cartItemsSnapshot.map(item => ({
        quantity: item.quantity,
        inventory: {
          product_names: item.product_name,
          skus: item.sku,
        }
      })),
    },
  })
});

    // 👇 YAHAN ORDER SUCCESS HO CHUKA HAI


    await fetch("/api/notifications/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "order",
        event: "order_placed",
        reference_id: orderData.id,
      }),
    });

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
          clearCart();
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
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium text-sm">Seller Contact Name *</label>
              <input
                name="sellerName"
                value={form.sellerName}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Seller Contact Email *</label>
              <input
                name="sellerEmail"
                value={form.sellerEmail}
                disabled
                className="border text-sm border-gray-300 p-2 rounded bg-gray-100 w-full"
              />
            </div>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Opportunity Details</div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium text-sm">
                Device Opportunity Size (Units) *
              </label>
              <input
                type="number"
                name="units"
                value={form.units}
                required
                onChange={handleChange}
                className="border text-sm border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Budget Per Device ($)</label>
              <input
  name="budget"
  value={`$ ${form.budget.toLocaleString()}`}
  disabled
  className="border text-sm border-gray-300 p-2 rounded bg-gray-100 w-full"
/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Revenue Opportunity Size ($ Device Rev) *
              </label>
              <input
  name="revenue"
  value={
    form.revenue
      ? `$ ${Number(form.revenue).toLocaleString()}`
      : ""
  }
  readOnly
  className="border text-sm border-gray-300 p-2 rounded bg-gray-100 w-full"
/>

            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Ingram Account # *</label>
              <input
                name="ingramAccount"
                value={form.ingramAccount}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Quote #</label>
              <input
                name="quote"
                value={form.quote}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Segment</label>
              <select
                name="segment"
                value={form.segment}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full text-sm"
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
              <label className="block mb-1 font-medium text-sm">Current Manufacturer</label>
              <select
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full text-sm"
              >
                <option value="" disabled hidden>
                  Select Manufacturer *
                </option>
                  <option value="Asus">Asus</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Panasonic">Panasonic</option>
                  <option value="Samsung">Samsung</option> 
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
                Is this a reseller opportunity?
              </label>
              <select
                name="isReseller"
                value={form.isReseller}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full text-sm"
              >
                <option value="" disabled hidden>
                  Select Opportunity *
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Estimated Close Date</label>
              <input
                type="date"
                name="estimatedCloseDate"
                value={form.estimatedCloseDate}
                required
                onChange={handleChange}
                className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

          </div>
        </div>

{/* Shipping Details */}
<div className="bg-white border rounded shadow border-gray-300">
  <div className="custom-blue text-white px-4 py-2 font-semibold">
    Shipping Details
  </div>

  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

    <div>
      <label className="block mb-1 font-medium text-sm">
        Customer Company Name *
      </label>
      <input
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">
        Customer Contact Name *
      </label>
      <input
        name="contactName"
        value={form.contactName}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">
        Customer Contact Email *
      </label>
      <input
        name="contactEmail"
        value={form.contactEmail}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">
        Customer Shipping Address *
      </label>
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium">State *</label>
      <select
        name="state"
        value={form.state}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      >
        <option value="" disabled hidden>
          Select State *
        </option>
        <option value="" disabled hidden>
                  Select State *
                </option>
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="District Of Columbia">District Of Columbia</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
                <option value="Armed Forces (AA)">Armed Forces (AA)</option>
                <option value="Armed Forces (AE)">Armed Forces (AE)</option>
                <option value="Armed Forces (AP)">Armed Forces (AP)</option>
                <option value="Alberta">Alberta</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Manitoba">Manitoba</option>
                <option value="New Brunswick">New Brunswick</option>
                <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                <option value="Nova Scotia">Nova Scotia</option>
                <option value="Ontario">Ontario</option>
                <option value="Prince Edward Island">Prince Edward Island</option>
                <option value="Quebec">Quebec</option>
                <option value="Saskatchewan">Saskatchewan</option>
                <option value="Northwest Territories">Northwest Territories</option>
                <option value="Nunavut">Nunavut</option>
                <option value="Yukon">Yukon</option>
      </select>
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">City *</label>
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">Zip *</label>
      <input
        name="zip"
        value={form.zip}
        onChange={handleChange}
        required
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-sm">
        Desired Delivery Date
      </label>
      <input
        type="date"
        name="deliveryDate"
        value={form.deliveryDate}
        required
        onChange={handleChange}
        className="border text-sm border-gray-300 p-2 rounded focus:border-black outline-none w-full"
      />
    </div>

    <div className="col-span-1 md:col-span-2">
      <label className="block mb-1 font-medium text-sm">Notes</label>
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
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
          
          <button className="custom-blue px-10 py-2.5 rounded-lg cursor-pointer text-white text-sm font-medium transition">
            
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
          className="w-full bg-blue-500 text-white  cursor-pointer py-2 rounded"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
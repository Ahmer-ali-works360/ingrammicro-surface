"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

type Product = {
  product_name: string;
  sku: string;
  quantity: string;
  inventory_owner: string;
};

export default function DispatchedDevicesPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { product_name: "", sku: "", quantity: "", inventory_owner: "" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setEmail(session.user.email || "");
      setUserId(session.user.id);
    };

    checkUser();
  }, [router]);

  const handleChange = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { product_name: "", sku: "", quantity: "", inventory_owner: "" },
    ]);
  };

  const removeProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isInvalid =
      !trackingNumber.trim() ||
      !shipmentDate ||
      products.some(
        (p) =>
          !p.product_name.trim() ||
          !p.sku.trim() ||
          !p.quantity.trim() ||
          !p.inventory_owner.trim()
      );

    if (isInvalid) {
      setModalMessage("Please fill all required fields.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch("/api/dispatched-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          submitted_by: email,
          tracking_number: trackingNumber,
          shipment_date: shipmentDate,
          products,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setModalMessage(result.error || "Something went wrong.");
        setShowModal(true);
        return;
      }



// ✅ Send email after successful DB insert
fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: [
      "ahmer.ali@works360.com",
      "email2@example.com",
      email,
    ],
    type: "DISPATCH_DEVICE_SUBMITTED",
    data: {
      submitted_by: email,
      tracking_number: trackingNumber,
      shipment_date: shipmentDate,
      products,
    },
  }),
});

setModalMessage("Devices dispatched successfully!");
setShowModal(true);

setTrackingNumber("");
setShipmentDate("");
setProducts([
  { product_name: "", sku: "", quantity: "", inventory_owner: "" },
]);

    } catch (error) {
      setModalMessage("Something went wrong.");
      setShowModal(true);
    }
  };

  return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
  <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-8">

    <h1 className="text-2xl font-semibold text-gray-800 text-center">
      Dispatched Devices
    </h1>


    <form onSubmit={handleSubmit} className="mt-8 space-y-8">

      {/* ================= Shipment Details ================= */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">

        <h2 className="text-base font-semibold text-gray-700 mb-6">
          Shipment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium mb-1">
              Submitted By
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tracking #
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Shipment
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={shipmentDate}
              onChange={(e) => setShipmentDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

        </div>
      </div>

      {/* ================= Product Details ================= */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">

        <h2 className="text-base font-semibold text-gray-700 mb-6">
          Product Details
        </h2>

        {products.map((product, index) => (
          <div
            key={index}
            className={`relative space-y-6 ${
              index > 0 ? "mt-8 pt-6 border-t border-gray-300" : ""
            }`}
          >
            {products.length > 1 && (
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="absolute cursor-pointer top-0 right-2 text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={product.product_name}
                  onChange={(e) =>
                    handleChange(index, "product_name", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product SKU
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) =>
                    handleChange(index, "sku", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Inventory Owner
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={product.inventory_owner}
                  onChange={(e) =>
                    handleChange(index, "inventory_owner", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>

            </div>
          </div>
        ))}

        {/* Shipping Address */}
      <div className="flex justify-start mt-8">
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 w-full md:w-1/2">
    <p className="font-medium mb-1">
      Send the devices to the following address:
    </p>
    <p>Works360 | ARAS (Ingenumua Surface)</p>
    <p>15436 Alaca Rd Unit A</p>
    <p>Visalia, CA 93291</p>
    <p>(412) 555-4045</p>
  </div>
</div>

        {/* Add Product Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={addProduct}
            className="flex cursor-pointer items-center justify-center w-10 h-10 rounded-full custom-blue text-white hover:opacity-90 transition"
          >
            <Plus size={16} />
          </button>
        </div>

      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="custom-blue cursor-pointer text-white px-10 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          Submit
        </button>
      </div>

    </form>
  </div>

  {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
      <p className="text-sm text-gray-700">
        {modalMessage}
      </p>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="custom-blue text-white px-4 py-2 rounded-md text-sm transition"
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
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

type Product = {
  product_name: string;
  sku: string;
  quantity: string;
  address: string;
  notes: string;
};

export default function EOLDevicesPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { product_name: "", sku: "", quantity: "", address: "", notes: "" },
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
      { product_name: "", sku: "", quantity: "", address: "", notes: "" },
    ]);
  };

  const removeProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isInvalid = products.some(
    (p) =>
      !p.product_name.trim() ||
      !p.sku.trim() ||
      !p.quantity.trim() ||
      !p.address.trim()
  );

  if (isInvalid) {
    setModalMessage("Please fill all required fields.");
    setShowModal(true);
    return;
  }

  try {
    const res = await fetch("/api/eol-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        submitted_by: email,
        products,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setModalMessage(result.error || "Something went wrong.");
      setShowModal(true);
      return;
    }

    // ✅ Send email only after successful DB insert
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [
          "ahmer.ali@works360.com",
          "email2@example.com",
          email,
        ],
        type: "EOL_DEVICE_SUBMITTED",
        data: {
          submitted_by: email,
          address: products[0]?.address,
          notes: products[0]?.notes,
          products,
        },
      }),
    });

    setModalMessage("EOL Devices submitted successfully!");
    setShowModal(true);

    setProducts([
      { product_name: "", sku: "", quantity: "", address: "", notes: "" },
    ]);

  } catch (error) {
    setModalMessage("Something went wrong.");
    setShowModal(true);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          EOL Devices
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Light Section Wrapper */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">

            {/* Submitted By */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Submitted By
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
              />
            </div>

            {/* Products */}
            {products.map((product, index) => (
              <div
  key={index}
  className={`relative space-y-4 ${index > 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}`}
>

                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                   className="absolute cursor-pointer top-0 right-0 text-red-500 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={product.product_name}
                      onChange={(e) =>
                        handleChange(index, "product_name", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) =>
                        handleChange(index, "sku", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleChange(index, "quantity", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={product.address}
                      onChange={(e) =>
                        handleChange(index, "address", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={product.notes}
                      onChange={(e) =>
                        handleChange(index, "notes", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-md bg-white"
                    />
                  </div>
                </div>

              </div>
            ))}

            {/* Add Icon */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full custom-blue text-white transition"
              >
                <Plus size={16} />
              </button>
            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="custom-blue cursor-pointer text-white px-8 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Submit
            </button>
          </div>

        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <p className="text-sm text-gray-700">{modalMessage}</p>
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

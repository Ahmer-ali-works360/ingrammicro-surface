"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login?redirect=/cart");
      } else {
        setAuthLoading(false);
      }
    });
  }, [router]);

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  // ---------------- Modal State ----------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"remove" | "clear" | null>(null);
  const [targetId, setTargetId] = useState<number | string | null>(null);

  const openRemoveModal = (id: number | string) => {
    setModalType("remove");
    setTargetId(id);
    setIsModalOpen(true);
  };

  const openClearModal = () => {
    setModalType("clear");
    setTargetId(null);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "remove" && targetId !== null) {
      removeFromCart(targetId);
    }
    if (modalType === "clear") {
      clearCart();
    }

    setIsModalOpen(false);
    setModalType(null);
    setTargetId(null);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ------------------ Left Column: Cart Items ------------------ */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.product_name}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />

                  {/* Product Details */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium">{item.product_name}</h2>
                    {item.sku && (
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    )}


                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Qty:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, (item.quantity ?? 1) - 1))
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-bold transition-colors"
                        >
                          −
                        </button>

                        <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                          {item.quantity ?? 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, (item.quantity ?? 1) + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => openRemoveModal(item.id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                  title="Remove item"
                >
                  🗑
                </button>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={openClearModal}
              className="custom-blue cursor-pointer text-white px-4 py-2 rounded  mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* ------------------ Right Column: Cart Summary ------------------ */}
          <div className="bg-white p-6 rounded shadow flex flex-col justify-between h-full">
            <div className="space-y-2">
              <h2 className="font-medium text-lg mb-2">Cart Summary</h2>
              <p>Total Item(s): {totalItems}</p>
              <p>Ships Within: 48 hours of Approval</p>
              <p>Shipment Type: Overnight</p>
              <p>Demo Period: Up to 30 Days</p>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full custom-blue text-white px-4 py-2 rounded  mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* ------------------ CONFIRM MODAL ------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-semibold text-lg mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">
              {modalType === "remove"
                ? "Do you want to remove this item from your cart?"
                : "Do you want to clear your cart?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

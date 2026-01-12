"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0); // ✅ fallback

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
                      <input
                        type="number"
                        min={1}
                        value={item.quantity ?? 1} // ✅ controlled with fallback
                        className="w-16 border rounded px-2 py-1 text-sm"
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                  title="Remove item"
                >
                  🗑
                </button>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
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
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

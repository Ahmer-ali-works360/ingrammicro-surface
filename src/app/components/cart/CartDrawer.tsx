"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTrash, FaTimes } from "react-icons/fa"; // X button icon
import { useState } from "react";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    clearCart,
    totalQuantity,
  } = useCart();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCheckout = () => {
    // If cart empty
    if (cartItems.length === 0) {
      setModalMessage("Your cart is empty. Please add product(s) first.");
      setIsModalOpen(true);
      return;
    }

    // If quantity limit exceeded
    if (totalQuantity > 3) {
      setModalMessage(
        "Your cart limit exceeded. Please update cart (max 3 total items)."
      );
      setIsModalOpen(true);
      return;
    }

    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div onClick={closeCart} className="fixed inset-0 bg-black/30 z-40" />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Your Cart</h2>

          <div className="flex items-center gap-2">
            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            )}

            {/* X Button to close drawer */}
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close Cart"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b pb-2"
              >
                {/* Product image */}
                <div className="w-16 h-16 relative flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product name */}
                <div className="flex-1 text-sm">{item.product_name}</div>

                {/* Remove button (dustbin icon) */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Buttons */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-3">
            <button
              onClick={() => {
                closeCart();
                router.push("/cart");
              }}
              className="w-full bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300 transition"
            >
              View Cart
            </button>

            {/* Checkout button now has validation */}
            <button
              onClick={handleCheckout}
              className="w-full custom-blue text-white py-2 rounded transition duration-200"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="bg-white rounded-lg p-6 z-60 w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-2">Attention</h2>
            <p className="text-gray-700 mb-4">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}

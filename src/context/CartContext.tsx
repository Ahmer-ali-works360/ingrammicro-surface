"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

/* -------------------- Cart Item Type -------------------- */
export type CartItem = {
  id: number | string;
  product_name: string;
  image_url?: string;
  sku?: string;
  brand?: string;
  processor?: string;
  memory?: string;
  quantity: number;
};

/* -------------------- Cart Context Type -------------------- */
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalQuantity: number;
};

/* -------------------- Create Context -------------------- */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* -------------------- Provider -------------------- */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  const toastOptions = {
    success: {
      duration: 7000,
      style: {
        background: "#54c500",
        color: "#fff",
        borderRadius: "8px",
        fontSize: isMobile ? "11px" : "12px",
        fontWeight: "400",
        minWidth: isMobile ? "200px" : "320px",
        maxWidth: isMobile ? "280px" : "500px",
        padding: isMobile ? "10px 14px" : "16px 20px",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10b981",
      },
    },
    error: {
      duration: 2000,
      style: {
        background: "#ef4444",
        color: "#fff",
        minWidth: isMobile ? "200px" : "320px",
        maxWidth: isMobile ? "280px" : "500px",
        padding: isMobile ? "10px 14px" : "16px 20px",
        borderRadius: "8px",
        fontSize: isMobile ? "11px" : "12px",
        fontWeight: "400",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
  };

  /* -------------------- Load cart from localStorage -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCartItems(JSON.parse(saved));
    setIsCartOpen(false);
  }, []);

  /* -------------------- Persist cart to localStorage -------------------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* -------------------- Helpers -------------------- */
  const getTotalQuantity = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  /* -------------------- Actions -------------------- */

  // Returns true if item was successfully added, false if rejected (qty > 3)
  const addToCart = (item: CartItem): boolean => {
    let success = false;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      const newCart = existing
        ? prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prev, { ...item, quantity: item.quantity }];

      const totalQty = getTotalQuantity(newCart);

      if (totalQty > 3) {
  toast.dismiss(); 
  toast.error(
    "You can only add maximum 3 items to the cart.",
    toastOptions.error
  );
  success = false;
  return prev;
}

      success = true;
      return newCart;
    });

    return success;
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (id: number | string, quantity: number) => {
    setCartItems((prev) => {
      const newCart = prev.map((i) =>
        i.id === id ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i
      );

      const totalQty = getTotalQuantity(newCart);
if (totalQty > 3) {
  toast.dismiss(); 
  toast.error(
    "You can only add maximum 3 items to the cart.",
    toastOptions.error
  );
  return prev;
}

      return newCart;
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalQuantity = getTotalQuantity(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        isCartOpen,
        openCart,
        closeCart,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* -------------------- Custom Hook -------------------- */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
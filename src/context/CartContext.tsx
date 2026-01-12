"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

/* -------------------- Cart Item Type -------------------- */
export type CartItem = {
  id: number | string;
  product_name: string;
  image_url?: string;
  sku?: string;
  slug?: string;
  quantity: number; // ✅ quantity added
};

/* -------------------- Cart Context Type -------------------- */
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  updateQuantity: (id: number | string, quantity: number) => void; // ✅ quantity updater
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

/* -------------------- Create Context -------------------- */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* -------------------- Provider -------------------- */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  /* -------------------- Actions -------------------- */
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // agar item already hai to quantity +1
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }]; // default quantity 1
    });
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (id: number | string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i
      )
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity, // ✅ added
        isCartOpen,
        openCart,
        closeCart,
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

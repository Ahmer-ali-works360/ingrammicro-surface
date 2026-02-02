"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  addToCart: (item: CartItem) => void;
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
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      // calculate new cart state (without setting it yet)
     const newCart = existing
      ? prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      : [...prev, { ...item, quantity: item.quantity }];

      // validate total quantity <= 3
      const totalQty = getTotalQuantity(newCart);
      if (totalQty > 3) return prev; // reject update

      return newCart;
    });
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

      // validate total quantity <= 3
      const totalQty = getTotalQuantity(newCart);
      if (totalQty > 3) return prev; // reject update

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

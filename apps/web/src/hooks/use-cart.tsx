"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, CartItemInput } from "@/lib/cart/types";
import { createCartItemKey } from "@/lib/cart/types";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addItem: (input: CartItemInput) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((input: CartItemInput) => {
    const key = createCartItemKey(input);

    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.key === key);
      if (existingIndex === -1) {
        return [...current, { ...input, key, quantity: 1 }];
      }

      return current.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      addItem,
      clearCart,
    }),
    [items, totalItems, addItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

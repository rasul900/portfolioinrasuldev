import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  promoDiscount: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setPromo: (code: string | null, discount: number) => void;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      promoDiscount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );
          if (existing) {
            existing.quantity += item.quantity ?? 1;
          } else {
            state.items.push({ ...item, quantity: item.quantity ?? 1 });
          }
          state.isOpen = true;
        }),

      removeItem: (productId, size, color) =>
        set((state) => {
          state.items = state.items.filter(
            (i) =>
              !(i.productId === productId && i.size === size && i.color === color)
          );
        }),

      updateQuantity: (productId, size, color, quantity) =>
        set((state) => {
          const item = state.items.find(
            (i) =>
              i.productId === productId && i.size === size && i.color === color
          );
          if (item) {
            if (quantity <= 0) {
              state.items = state.items.filter((i) => i !== item);
            } else {
              item.quantity = quantity;
            }
          }
        }),

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      total: () => {
        const sub = get().subtotal();
        const discount = sub * (get().promoDiscount / 100);
        return Math.max(0, sub - discount);
      },
    })),
    { name: "rasul-dev-cart" }
  )
);

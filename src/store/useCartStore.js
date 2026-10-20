import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Global cart store (Zustand + localStorage persistence).
 * Shape: { items: [{ id, name, price, image, qty, colorway }], promoCode, promoDiscount }
 */

const PROMO_CODES = {
  EYECARE10: 0.1,
  TALPUR20: 0.2,
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                frameSvg: product.frameSvg,
                tint: product.tint,
                colorway: product.colorway,
                category: product.category,
                qty,
              },
            ],
          };
        });
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        }));
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = PROMO_CODES[normalized];
        if (discount) {
          set({ promoCode: normalized, promoDiscount: discount });
          return { success: true, discount };
        }
        set({ promoCode: null, promoDiscount: 0 });
        return { success: false };
      },

      removePromo: () => set({ promoCode: null, promoDiscount: 0 }),

      // ---- Derived getters ----
      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      getDiscount: () => get().getSubtotal() * get().promoDiscount,

      getShipping: () => (get().items.length === 0 ? 0 : get().getSubtotal() > 150 ? 0 : 9.95),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(subtotal - discount + shipping, 0);
      },
    }),
    {
      name: "talpur-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

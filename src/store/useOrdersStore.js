import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Persisted order history — written on successful checkout, read by the
 * Order Confirmation page and (future) an order-history view.
 */
export const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "talpur-orders-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

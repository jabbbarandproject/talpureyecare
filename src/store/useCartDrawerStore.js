import { create } from "zustand";

/**
 * UI-only store (no persistence) controlling the slide-out cart drawer.
 * Kept separate from useCartStore so cart *data* and drawer *visibility*
 * don't share persisted state — opening/closing shouldn't survive a reload.
 */
export const useCartDrawerStore = create((set) => ({
  isOpen: false,
  lastAddedId: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  openWithItem: (productId) => set({ isOpen: true, lastAddedId: productId }),
}));

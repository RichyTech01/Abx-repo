import { create } from "zustand";
import OrderApi from "@/api/OrderApi";

export interface CartItem {
  id: string | number;
  product_id: string | number;
  quantity: number;
  name: string;
  price: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCart: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await OrderApi.getCart();
      set({ items: res.items || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToCart: async (item: Omit<CartItem, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const res = await OrderApi.addToCart({
        ...item,
        product_id: Number(item.product_id),
      });
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      await OrderApi.removeFromCart(Number(itemId));
      set({
        items: get().items.filter((i) => i.id !== itemId),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateCart: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await OrderApi.updateCart(Number(itemId), { quantity });
      set({
        items: get().items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearCart: () => set({ items: [] }),
}));

import { create } from "zustand";
import OrderApi from "@/api/OrderApi";
import {
  CartItem,
  Cart,
} from "@/types/carts";

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  increaseQuantity: (cartItemId: number) => Promise<void>;
  decreaseQuantity: (cartItemId: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const cart: Cart = await OrderApi.getCart();

      set({ items: cart.items });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      set({ loading: false });
    }
  },

  increaseQuantity: async (cartItemId) => {
    const item = get().items.find((i) => i.id === cartItemId);
    if (!item) return;

    try {
      await OrderApi.updateCart(cartItemId, { action: "increase" });

      set((state) => ({
        items: state.items.map((i) =>
          i.id === cartItemId
            ? {
                ...i,
                quantity: i.quantity + 1,
                total: (i.quantity + 1) * i.price,
              }
            : i
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Decrease quantity of a cart item
  decreaseQuantity: async (cartItemId) => {
    const item = get().items.find((i) => i.id === cartItemId);
    if (!item || item.quantity <= 1) return;

    try {
      await OrderApi.updateCart(cartItemId, { action: "decrease" });

      set((state) => ({
        items: state.items.map((i) =>
          i.id === cartItemId
            ? {
                ...i,
                quantity: i.quantity - 1,
                total: (i.quantity - 1) * i.price,
              }
            : i
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Remove an item from the cart
  removeItem: async (cartItemId) => {
    try {
      await OrderApi.removeFromCart(cartItemId); // API expects item ID
      set((state) => ({
        items: state.items.filter((i) => i.id !== cartItemId),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));

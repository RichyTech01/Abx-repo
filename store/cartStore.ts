import { create } from "zustand";
import OrderApi from "@/api/OrderApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Cart } from "@/types/carts";

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (payload: { product_id: number }) => Promise<void>;
  updateItem: (
    cartItemId: number,
    action: "increase" | "decrease"
  ) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const cart: Cart = await OrderApi.getCart();
      const cartId = await AsyncStorage.getItem("cartId");
      console.log("Fetched cart:", cart);
      console.log("Stored cartId:", cartId);
      set({ items: cart.items || [] });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (payload) => {
    console.log("CartStore - addItem called with payload:", payload);
    set({ loading: true });
    try {
      const res = await OrderApi.addToCart(payload);

      // If backend returned cart_id, save it
      if (res?.cart_id) {
        await AsyncStorage.setItem("cartId", res.cart_id.toString());
      }

      set((state) => {
        const existingIndex = state.items.findIndex(
          (item) => item.product_id === payload.product_id
        );

        if (existingIndex >= 0) {
          // Already exists → increase qty
          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + 1,
          };
          return { items: updatedItems };
        } else {
          // New product
          return {
            items: [
              ...state.items,
              { product_id: payload.product_id, quantity: 1 },
            ],
          };
        }
      });
    } catch (err: any) {
      console.error("Failed to add item:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (cartItemId, action) => {
    const currentItems = get().items;
    const item = currentItems.find((i) => i.id === cartItemId);

    if (!item) return;

    // Optimistically update UI
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id === cartItemId) {
          const newQty =
            action === "increase" ? i.quantity + 1 : i.quantity - 1;
          return {
            ...i,
            quantity: newQty,
            total_item_price: newQty * parseFloat(i.item.price),
          };
        }
        return i;
      }),
    }));

    try {
      const updated = await OrderApi.updateCart(cartItemId, { action });
      // Update with actual response
      set((state) => ({
        items: state.items.map((i) => (i.id === cartItemId ? updated : i)),
      }));
    } catch (err) {
      console.error("Failed to update cart item:", err);
      // Revert optimistic update
      set({ items: currentItems });
      throw err;
    }
  },

  removeItem: async (cartItemId) => {
    const currentItems = get().items;

    // Optimistically remove item
    set((state) => ({
      items: state.items.filter((i) => i.id !== cartItemId),
    }));

    try {
      await OrderApi.removeFromCart(cartItemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
      // Revert optimistic update
      set({ items: currentItems });
      throw err;
    }
  },

  clearCart: () => {
    set({ items: [] });
  },
}));

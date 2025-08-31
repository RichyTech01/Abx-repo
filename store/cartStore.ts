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

 updateItem: async (productId, action) => {
  const currentItems = get().items;
  const item = currentItems.find((i) => i.product_id === productId);

  if (!item) return;

  // Use item.id here, not productId
  const cartItemId = item.id;

  // Optimistic update
  set((state) => ({
    items: state.items.map((i) => {
      if (i.product_id === productId) {
        const newQty = action === "increase" ? i.quantity + 1 : i.quantity - 1;
        return {
          ...i,
          quantity: newQty,
        };
      }
      return i;
    }),
  }));

  try {
    const updated = await OrderApi.updateCart(cartItemId, { action });
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === productId ? updated : i
      ),
    }));
  } catch (err) {
    console.error("Failed to update cart item:", err);
    set({ items: currentItems }); // rollback
    throw err;
  }
},

removeItem: async (productId) => {
  const currentItems = get().items;

  set((state) => ({
    items: state.items.filter((i) => i.product_id !== productId),
  }));

  try {
    await OrderApi.removeFromCart(productId);
  } catch (err) {
    console.error("Failed to remove item:", err);
    set({ items: currentItems });
    throw err;
  }
},


  clearCart: () => {
    set({ items: [] });
  },
}));

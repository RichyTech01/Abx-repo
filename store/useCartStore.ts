import { create } from "zustand";
import OrderApi from "@/api/OrderApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CartItem = {
  id: number;
  quantity: number;
  total_item_price: number;
  item: any;
};

type CartState = {
  cartItems: CartItem[];
  lastFetchTime: number;
  isFetching: boolean;
  shouldRefetch: boolean;
  setCartItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  reset: () => void;
  refreshCart: () => Promise<void>;
  setShouldRefetch: (value: boolean) => void;
  getCartCount: () => number;
  getTotalValue: () => number;
};

const FETCH_COOLDOWN = 15000;

const initialState: Pick<
  CartState,
  "cartItems" | "lastFetchTime" | "isFetching" | "shouldRefetch"
> = {
  cartItems: [],
  lastFetchTime: 0,
  isFetching: false,
  shouldRefetch: true,
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  lastFetchTime: 0,
  isFetching: false,
  shouldRefetch: true,

  setCartItems: (items) => set({ cartItems: items }),

  addItem: (item) =>
    set((state) => ({ cartItems: [...state.cartItems, item] })),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity,
              total_item_price: quantity * parseFloat(i.item.price),
            }
          : i
      ),
    })),

  clearCart: () => set({ cartItems: [] }),

  reset: () => set(initialState),

  setShouldRefetch: (value) => set({ shouldRefetch: value }),

  // Refresh cart from API with throttling
  refreshCart: async () => {
    const state = get();

    // Prevent concurrent requests
    if (state.isFetching) {
      console.log("Cart fetch already in progress, skipping...");
      return;
    }

    // Check cooldown (skip if recently fetched)
    const now = Date.now();
    if (now - state.lastFetchTime < FETCH_COOLDOWN) {
      console.log(
        `Cart fetch on cooldown (${Math.round(
          (FETCH_COOLDOWN - (now - state.lastFetchTime)) / 1000
        )}s remaining), skipping...`
      );
      return;
    }

    set({ isFetching: true, lastFetchTime: now });

    try {
      const res = await OrderApi.getCart();

      if (res?.cart) {
        const items = res.cart.items || [];
        const cartId = res.cart.id;

        set({ cartItems: items });

        if (cartId) {
          await AsyncStorage.setItem("cartId", cartId);
        }
      } else {
        // No cart yet
        set({ cartItems: [] });
        await AsyncStorage.removeItem("cartId");
      }
    } catch (err: any) {
      const status = err?.response?.status;

      // Handle 429 specifically
      if (status === 429) {
        console.log("Rate limited! Come back later...");
        // Extend the cooldown temporarily
        set({ lastFetchTime: now + FETCH_COOLDOWN * 2 });
        return;
      }

      if (status === 404 || status === 500) {
        set({ cartItems: [] });
        await AsyncStorage.removeItem("cartId");
      } else {
        console.error("Failed to refresh cart:", err);
      }
    } finally {
      set({ isFetching: false });
    }
  },

  // Get total number of items in cart
  getCartCount: () => get().cartItems.length,

  // Get total value of cart
  getTotalValue: () =>
    get().cartItems.reduce(
      (acc, item) => acc + parseFloat(String(item.total_item_price)),
      0
    ),
}));

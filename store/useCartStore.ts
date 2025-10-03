import { create } from "zustand";

type CartItem = {
  id: number;
  quantity: number;
  total_item_price: number;
  item: any;
};

type CartState = {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  reset: () => void;
  // Computed getter for cart count
  getCartCount: () => number;
  // Computed getter for total cart value
  getTotalValue: () => number;
};

const initialState: Pick<CartState, "cartItems"> = {
  cartItems: [],
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
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
  // Get total number of items in cart
  getCartCount: () => get().cartItems.length,

  // Get total value of cart
  getTotalValue: () =>
    get().cartItems.reduce(
      (acc, item) => acc + parseFloat(String(item.total_item_price)),
      0
    ),
}));

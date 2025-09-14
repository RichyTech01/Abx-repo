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
};

export const useCartStore = create<CartState>((set) => ({
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
          ? { ...i, quantity, total_item_price: quantity * parseFloat(i.item.price) }
          : i
      ),
    })),
  clearCart: () => set({ cartItems: [] }),
}));

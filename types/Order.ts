export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
  options?: Record<string, any>;
}

export interface UpdateCartData {
  quantity?: number;
  options?: Record<string, any>;
}

export interface OrderStatusData {
  status: string; // e.g., "pending", "completed", "shipped"
}

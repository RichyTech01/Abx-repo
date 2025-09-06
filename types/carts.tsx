// Store info
export interface Store {
  id: number;
  business_name: string;
  location: string;
}

// Product info
export interface Product {
  id: number;
  item_name: string;
  prod_image_url: string;
  store: Store;
}

// The variation (what user is actually buying)
export interface VariationItem {
  id: number;
  weight: string;         // "2"
  price: string;          // "10.00"
  display_price: string;  // "12.00"
  discount_price: string | null;
  stock: number;
  product: Product;
}

// A single cart line item
export interface CartItem {
  id: number;
  item: VariationItem;
  quantity: number;
  total_item_price: number;
}

// The cart object itself
export interface Cart {
  id: string;
  user: number;
  is_active: boolean;
  created_at: string;
  items: CartItem[];
}

// The full cart API response
export interface CartResponse {
  cart: Cart;
  cart_id: string;
}

// Request to add an item to the cart
export interface AddToCartRequest {
  product_id: number;
}

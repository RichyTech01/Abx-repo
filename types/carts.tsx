

export interface CartResponse {
  cart: {
    id: string;
    items: CartItem[];
    created_at: string;
    is_active: boolean;
    user: number;
  };
  cart_id: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  created_at: string;
  is_active: boolean;
  user: number;
}


export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}
export interface Product {
  id: number;
  item_name: string;
  prod_image_url: string;
}
export interface Address {
  id: number;
  addr: string;
  city: string;
  post_code: string;
  default_addr: boolean;
  location?: any; // or a proper type for your coordinates
} 
export interface CartItemData {
  id: number;
  item: {
    product: Product;
    weight: string;
    price: string;
    display_price: string;
    discount_price?: string | null;
    stock: number;
  };
  quantity: number;
  total_item_price: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

interface CartItemDetail {
  id: number;
  price: string; // "7.50"
  display_price: string; // "9.00"
  discount_price: string | null;
  stock: number;
  weight: string; // "5"
  product: Product;
}

export interface CartItemtype {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface CartItem {
  id: number;
  item: CartItemDetail;
  quantity: number;
  total_item_price: number;
}

export type CartItemsType = CartItem[];

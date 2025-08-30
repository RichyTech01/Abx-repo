
export interface BackendCartItem {
  id: number;
  item: {
    id: number;
    product: {
      id: number;
      item_name: string;
      prod_image_url: string;
      store: { id: number; business_name: string; location: string };
    };
    weight: string;
    price: string;
    display_price: string;
    discount_price?: string | null;
    stock: number;
  };
  quantity: number;
  total_item_price: number;
}

export interface BackendCart {
  id: string;
  user: number;
  is_active: boolean;
  created_at: string;
  items: BackendCartItem[];
}

// Frontend types
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export interface ChangeOrderStatus {
  status: OrderStatus;
}
 
export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

// Mapper function
export function mapBackendCartToCart(cart: BackendCart): Cart {
  const items: CartItem[] = cart.items.map((i) => ({
    id: i.id,
    product_id: i.item.product.id,
    name: i.item.product.item_name,
    price: parseFloat(i.item.price),
    quantity: i.quantity,
    total: i.total_item_price,
    image: i.item.product.prod_image_url,
  }));

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.total, 0);

  return { items, totalQuantity, totalPrice };
}



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

export interface Address {
  id: number;
  addr: string;
  post_code: string;
  city: string;
  location: {
    type: "Point";
    coordinates: [number, number]; 
  };
  default_addr: boolean;
}


// types/Order.ts
export interface OrderType {
  id: string;
  customer_names: string;
  order_code: string;
  store_code: string;
  total_items: string;
  store_total_price: string;
  status: string;
  created_at: string;
  grand_total: string;
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrderType[];
}

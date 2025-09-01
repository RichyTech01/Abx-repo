

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



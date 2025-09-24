
export interface Notification {
  id?: number;
  title?: string;
  message: string;
  notification_type?: string;
  data?: any;
  is_read?: boolean;
  created_at?: string;
  type?: "order_status_update" | "location_update" | "general";
  status?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export type MessageCallback = (notification: Notification) => void;
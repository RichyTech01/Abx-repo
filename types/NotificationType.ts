
export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export type MessageCallback = (notification: Notification) => void;
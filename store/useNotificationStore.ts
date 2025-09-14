import { create } from "zustand";
import NotificationApi from "@/api/NotificationApi";

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async () => {
    try {
      const data = await NotificationApi.getNotifications(1);
      const unread = data.results?.filter((n: any) => !n.is_read) || [];
      set({ unreadCount: unread.length });
    } catch (err) {
      console.error("❌ Error fetching notifications", err);
    }
  },

  markAllAsRead: async () => {
    try {
      const data = await NotificationApi.getNotifications(1);
      const unread = data.results?.filter((n: any) => !n.is_read) || [];

      if (unread.length === 0) return;

      await Promise.all(
        unread.map((n: any) =>
          NotificationApi.markAsReadPartial(n.id, {
            title: n.title,
            message: n.message,
            notification_type: n.notification_type,
            data: n.data,
          })
        )
      );

      set({ unreadCount: 0 }); // reset after marking all
    } catch (err) {
      console.error("❌ Error marking all as read", err);
    }
  },
}));

import { create } from "zustand";
import { Notification } from "@/types/NotificationType";
import NotificationApi from "@/api/NotificationApi";

interface NotificationStore {
  notifications: Notification[];
  hasNewNotifications: boolean;
  loading: boolean;
  lastFetchTime: number | null; // Track when we last fetched

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addRealtimeNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  setHasNewNotifications: (hasNew: boolean) => void;
  setLoading: (loading: boolean) => void;
  fetchNotifications: (force?: boolean) => Promise<void>; // Add force parameter
  markNotificationsAsSeen: () => void;
  checkNotificationStatus: () => Promise<void>; // Just check status, don't fetch full list

  // Real-time handler
  handleRealtimeNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  hasNewNotifications: false,
  loading: false,
  lastFetchTime: null,

  setNotifications: (notifications) =>
    set({
      notifications,
      hasNewNotifications: notifications.some((n) => !n.is_read),
      lastFetchTime: Date.now(),
    }),

  addRealtimeNotification: (notification) =>
    set((state) => {
      // Check if notification already exists to avoid duplicates
      const exists = state.notifications.find((n) => n.id === notification.id);
      if (exists) return state;

      return {
        notifications: [notification, ...state.notifications],
        hasNewNotifications: true,
      };
    }),

  markNotificationAsRead: (notificationId) =>
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );

      return {
        notifications: updatedNotifications,
        hasNewNotifications: updatedNotifications.some((n) => !n.is_read),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      hasNewNotifications: false,
    })),

  setHasNewNotifications: (hasNew) => set({ hasNewNotifications: hasNew }),

  setLoading: (loading) => set({ loading }),

  markNotificationsAsSeen: () => set({ hasNewNotifications: false }),

  // Lightweight method - just check if there are unread notifications
  checkNotificationStatus: async () => {
    try {
      const data = await NotificationApi.getNotifications();
      const notifications = data.results || [];
      const hasUnread = notifications.some((n: Notification) => !n.is_read);
      set({ hasNewNotifications: hasUnread });
    } catch (err) {
      console.error("Error checking notification status:", err);
    }
  },

  // Full fetch method - only fetch if forced or haven't fetched recently
  fetchNotifications: async () => {

    try {
      set({ loading: true });
      const data = await NotificationApi.getNotifications();
      const notifications = data.results || [];

      set({
        notifications,
        hasNewNotifications: notifications.some(
          (n: Notification) => !n.is_read
        ),
        // lastFetchTime: now,
      });
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      set({ loading: false });
    }
  },

  // Handle real-time notifications
  handleRealtimeNotification: (newNotification) => {
    const { addRealtimeNotification } = get();
    addRealtimeNotification(newNotification);
  },
}));

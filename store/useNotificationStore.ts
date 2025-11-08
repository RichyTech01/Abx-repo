import { create } from "zustand";
import { Notification } from "@/types/NotificationType";
import NotificationApi from "@/api/NotificationApi";

interface NotificationStore {
  notifications: Notification[];
  hasNewNotifications: boolean;
  loading: boolean;
  loadingMore: boolean;
  unreadCount: number;
  lastFetchTime: number | null;
  currentPage: number;
  hasMore: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addRealtimeNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  setHasNewNotifications: (hasNew: boolean) => void;
  setLoading: (loading: boolean) => void;
  fetchNotifications: (force?: boolean) => Promise<void>;
  fetchMoreNotifications: () => Promise<void>;
  markNotificationsAsSeen: () => void;
  checkNotificationStatus: () => Promise<void>;

  // Real-time handler
  handleRealtimeNotification: (notification: Notification) => void;

  reset: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  hasNewNotifications: false,
  loading: false,
  unreadCount: 0,
  loadingMore: false,
  lastFetchTime: null,
  currentPage: 1,
  hasMore: true,

  setNotifications: (notifications) =>
    set({
      notifications,
      hasNewNotifications: notifications.some((n) => !n.is_read),
      unreadCount: notifications.filter((n) => !n.is_read).length,
      lastFetchTime: Date.now(),
    }),

  addRealtimeNotification: (notification) =>
    set((state) => {
      // Check if notification already exists to avoid duplicates
      const exists = state.notifications.find((n) => n.id === notification.id);
      if (exists) return state;

      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        hasNewNotifications: true,
        unreadCount: state.unreadCount + 1, // Increment unread count
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
        unreadCount: updatedNotifications.filter((n) => !n.is_read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      hasNewNotifications: false,
      unreadCount: 0,
    })),

  setHasNewNotifications: (hasNew) => set({ hasNewNotifications: hasNew }),

  setLoading: (loading) => set({ loading }),

  markNotificationsAsSeen: () => set({ hasNewNotifications: false }),

  // Lightweight method - just check if there are unread notifications
  checkNotificationStatus: async () => {
    try {
      // Fetch first page to get unread_count from API
      const data = await NotificationApi.getNotifications(1);

      // Use the unread_count directly from API response
      const unreadCount = data.unread_count || 0;

      set({
        hasNewNotifications: unreadCount > 0,
        unreadCount: unreadCount,
      });
    } catch (err) {
      console.error("Error checking notification status:", err);
    }
  },

  // Full fetch method - initial load
  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const data = await NotificationApi.getNotifications(1);

      // Updated to match new API structure
      const notifications = data.notifications || [];
      const unreadCount = data.unread_count || 0;

      set({
        notifications,
        unreadCount,
        hasNewNotifications: unreadCount > 0,
        currentPage: 1,
        hasMore: !!data.next, // Check if pagination still exists
        lastFetchTime: Date.now(),
      });
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch more notifications (pagination)
  fetchMoreNotifications: async () => {
    const { currentPage, hasMore, loadingMore, notifications } = get();

    // Don't fetch if already loading or no more data
    if (loadingMore || !hasMore) {
      return;
    }

    try {
      set({ loadingMore: true });

      const nextPage = currentPage + 1;
      const data = await NotificationApi.getNotifications(nextPage);

      // Updated to match new API structure
      const newNotifications = data.notifications || [];

      set({
        notifications: [...notifications, ...newNotifications],
        currentPage: nextPage,
        hasMore: !!data.next,
        loadingMore: false,
      });
    } catch (err) {
      console.error("Error fetching more notifications", err);
      set({ loadingMore: false });
    }
  },

  // Handle real-time notifications
  handleRealtimeNotification: (newNotification) => {
    const { addRealtimeNotification } = get();
    addRealtimeNotification(newNotification);
  },

  reset: () =>
    set({
      notifications: [],
      hasNewNotifications: false,
      loading: false,
      loadingMore: false,
      unreadCount: 0,
      lastFetchTime: null,
      currentPage: 1,
      hasMore: true,
    }),
}));

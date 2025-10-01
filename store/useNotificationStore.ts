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
  currentPage: number; // Track current page number
  hasMore: boolean; // Track if there are more notifications to load

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addRealtimeNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  setHasNewNotifications: (hasNew: boolean) => void;
  setLoading: (loading: boolean) => void;
  fetchNotifications: (force?: boolean) => Promise<void>;
  fetchMoreNotifications: () => Promise<void>; // New method for pagination
  markNotificationsAsSeen: () => void;
  checkNotificationStatus: () => Promise<void>;

  // Real-time handler
  handleRealtimeNotification: (notification: Notification) => void;
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
        unreadCount: updated.filter((n) => !n.is_read).length, 
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
    let page = 1;
    let unreadTotal = 0;
    let hasNext = true;

    while (hasNext) {
      const data = await NotificationApi.getNotifications(page);

      unreadTotal += data.results.filter((n: Notification) => !n.is_read).length;

      hasNext = !!data.next;
      page++;
    }

    set({
      hasNewNotifications: unreadTotal > 0,
      unreadCount: unreadTotal,
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
      const notifications = data.results || [];

      set({
        notifications,
        hasNewNotifications: notifications.some(
          (n: Notification) => !n.is_read
        ),
        currentPage: 1,
        hasMore: !!data.next,
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
      const newNotifications = data.results || [];

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
}));

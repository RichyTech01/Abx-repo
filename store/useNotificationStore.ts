import { create } from "zustand";
import { Notification } from "@/types/NotificationType";
import NotificationApi from "@/api/NotificationApi";

// Stale time for full notification list: 30 seconds
const LIST_STALE_TIME = 30000;

// Stale time for count check: 5 seconds (more frequent for badge accuracy)
const COUNT_STALE_TIME = 5000;

interface NotificationStore {
  notifications: Notification[];
  hasNewNotifications: boolean;
  loading: boolean;
  loadingMore: boolean;
  unreadCount: number;
  lastFetchTime: number | null;
  lastCountCheckTime: number | null;
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
  lastCountCheckTime: null,
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
      const exists = state.notifications.find((n) => n.id === notification.id);
      if (exists) return state;

      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        hasNewNotifications: true,
        unreadCount: state.unreadCount + 1,
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

  checkNotificationStatus: async () => {
    const { lastCountCheckTime } = get();

    // Check if count was checked recently
    if (lastCountCheckTime) {
      const timeSinceLastCheck = Date.now() - lastCountCheckTime;

      if (timeSinceLastCheck < COUNT_STALE_TIME) {
        console.log("📊 Using cached notification count (still fresh)");
        return; // Count is still fresh
      }
    }

    try {
      const data = await NotificationApi.getNotifications(1);
      const unreadCount = data.unread_count || 0;

      set({
        hasNewNotifications: unreadCount > 0,
        unreadCount: unreadCount,
        lastCountCheckTime: Date.now(),
      });
    } catch (err) {
      console.error("Error checking notification status:", err);
    }
  },

  // ✅ Modified: Check stale time before fetching full list
  fetchNotifications: async (force = false) => {
    const { lastFetchTime, notifications } = get();

    // Check if data is still fresh (unless forced or first load)
    if (!force && lastFetchTime && notifications.length > 0) {
      const timeSinceLastFetch = Date.now() - lastFetchTime;

      if (timeSinceLastFetch < LIST_STALE_TIME) {
        console.log("📦 Using cached notifications (still fresh)");
        return; // Data is still fresh, skip fetch
      }
    }

    try {
      // Only show loading spinner on initial load
      if (!lastFetchTime) {
        set({ loading: true });
      }

      const data = await NotificationApi.getNotifications(1);
      const notifications = data.notifications || [];
      const unreadCount = data.unread_count || 0;

      set({
        notifications,
        unreadCount,
        hasNewNotifications: unreadCount > 0,
        currentPage: 1,
        hasMore: !!data.next,
        lastFetchTime: Date.now(),
        lastCountCheckTime: Date.now(), // Update count check time too
      });
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchMoreNotifications: async () => {
    const { currentPage, hasMore, loadingMore, notifications } = get();

    if (loadingMore || !hasMore) {
      return;
    }

    try {
      set({ loadingMore: true });

      const nextPage = currentPage + 1;
      const data = await NotificationApi.getNotifications(nextPage);
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
      lastCountCheckTime: null,
      currentPage: 1,
      hasMore: true,
    }),
}));

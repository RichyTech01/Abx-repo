import { create } from 'zustand';

interface NotificationStore {
  hasNewNotifications: boolean;
  setHasNewNotifications: (hasNew: boolean) => void;
  markNotificationsAsSeen: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  hasNewNotifications: false,
  setHasNewNotifications: (hasNew) => set({ hasNewNotifications: hasNew }),
  markNotificationsAsSeen: () => set({ hasNewNotifications: false }),
}));
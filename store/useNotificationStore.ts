import { create } from 'zustand';

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: (amount?: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnreadCount: (amount = 1) => 
    set((state) => ({ 
      unreadCount: Math.max(0, state.unreadCount - amount) 
    })),
}));
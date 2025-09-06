import { create } from "zustand";
import AuthApi from "@/api/AuthApi";
import { AppUser } from "@/types/store";

interface UserStore {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: AppUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await AuthApi.getMe();
      set({ user: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user" });
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

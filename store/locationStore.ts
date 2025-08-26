import { create } from "zustand";
import * as Location from "expo-location";

type LocationStatus = "idle" | "pending" | "success" | "error";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  status: LocationStatus;
  error: string | null;
  requestLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  status: "idle",
  error: null,

  requestLocation: async () => {
    try {
      set({ status: "pending", error: null });
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        set({ status: "error", error: "Location permission denied" });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      set({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        status: "success",
        error: null,
      });
    } catch (err: any) {
      set({ status: "error", error: err.message });
    }
  },
}));

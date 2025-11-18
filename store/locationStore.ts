import { create } from "zustand";
import * as Location from "expo-location";
import showToast from "@/utils/showToast";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  hasPermission: boolean | null;
  error: string | null;
  isInitialized: boolean;
  permissionChecked: boolean;

  // Actions
  requestLocation: () => Promise<void>;
  checkPermissionOnly: () => Promise<boolean>;
  setLocation: (lat: number, lng: number) => void;
  clearLocation: () => void;
  reset: () => void;
}

let locationPromise: Promise<void> | null = null;

export const useLocationStore = create<LocationState>((set, get) => ({
  latitude: null,
  longitude: null,
  isLoading: false,
  hasPermission: null,
  error: null,
  isInitialized: false,
  permissionChecked: false,

  checkPermissionOnly: async () => {
    const state = get();

    // Return cached result if already checked
    if (state.permissionChecked && state.hasPermission !== null) {
      return state.hasPermission;
    }

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const granted = status === "granted";

      set({
        hasPermission: granted,
        permissionChecked: true,
      });

      return granted;
    } catch (error) {
      set({ permissionChecked: true, hasPermission: false });
      return false;
    }
  },

  requestLocation: async () => {
    const state = get();

    // If already loading, return the existing promise
    if (locationPromise) {
      return locationPromise;
    }

    // If we already have location and it's recent, don't fetch again
    if (state.latitude && state.longitude && state.isInitialized) {
      return;
    }

    locationPromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        // First check if we already have permission
        let hasPermission = state.hasPermission;

        if (!state.permissionChecked) {
          const { status: existingStatus } =
            await Location.getForegroundPermissionsAsync();
          hasPermission = existingStatus === "granted";
          set({ permissionChecked: true, hasPermission });
        }

        // If no permission, request it
        if (!hasPermission) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          hasPermission = status === "granted";

          set({
            hasPermission,
            permissionChecked: true,
          });

          if (!hasPermission) {
            set({
              isLoading: false,
              error: "Location permission denied",
              isInitialized: true,
            });
            showToast("info", "Location permission denied");
            return;
          }
        }

        // Get location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        set({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          isLoading: false,
          isInitialized: true,
          hasPermission: true,
        });

        // console.log("Location obtained:", {
        //   lat: location.coords.latitude,
        //   lng: location.coords.longitude,
        // });
      } catch (error) {
        console.error("Error getting location:", error);
        set({
          error: "Failed to get location",
          isLoading: false,
          hasPermission: false,
          isInitialized: true,
        });
      } finally {
        locationPromise = null; // Clear the promise
      }
    })();

    return locationPromise;
  },

  setLocation: (lat: number, lng: number) => {
    set({
      latitude: lat,
      longitude: lng,
      hasPermission: true,
      isLoading: false,
      isInitialized: true,
    });
  },

  clearLocation: () => {
    set({
      latitude: null,
      longitude: null,
      error: null,
    });
  },

  reset: () => {
    locationPromise = null;
    set({
      latitude: null,
      longitude: null,
      isLoading: false,
      hasPermission: null,
      error: null,
      isInitialized: false,
      permissionChecked: false,
    });
  },
}));

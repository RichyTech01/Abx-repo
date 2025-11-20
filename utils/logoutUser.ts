import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import apiService from "@/api/apiService";
import { useCartStore } from "@/store/useCartStore";

export const logoutUser = async (router: ReturnType<typeof useRouter>) => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("isGuest");
    await AsyncStorage.removeItem("cartId");

    apiService.getClient().defaults.headers["Authorization"] = "";

    // Reset all Zustand stores
    useUserStore.getState().clearUser();
    useNotificationStore.getState().reset();
    useCartStore.getState().reset();

    // Navigate to onboarding
    router.replace("/OnboardingScreen");
  } catch (err) {
    console.error("Failed to log out:", err);
  }
};

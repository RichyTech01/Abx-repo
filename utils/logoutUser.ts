import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useCartStore } from "@/store/useCartStore";
import AuthApi from "@/api/AuthApi";
import showToast from "./showToast";

export const logoutUser = async (router: ReturnType<typeof useRouter>) => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const pushToken = await AsyncStorage.getItem("PushNotificationToken");

    if (refreshToken && pushToken) {
      await AuthApi.logout({
        refresh: refreshToken,
        device_token: pushToken,
      });
    }

    await AsyncStorage.multiRemove([
      "accessToken",
      "refreshToken",
      "cartId",
      "PushNotificationToken",
    ]);

    // Reset all Zustand stores
    useUserStore.getState().clearUser();
    useNotificationStore.getState().reset();
    useCartStore.getState().reset();

    // Navigate to onboarding
    router.replace("/OnboardingScreen");
  } catch (err: any) {
    console.error("Failed to log out:", err);
    showToast("error", err);
  }
};

import "./global.css";
import { useEffect, useCallback, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/toastConfig";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  useFonts,
  OrelegaOne_400Regular,
} from "@expo-google-fonts/orelega-one";
import {
  Urbanist_300Light_Italic,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope";
import { useLocationStore } from "@/store/locationStore";

// Import MQTT and stores
import MQTTClient from "@/utils/mqttClient";
import PushNotificationService from "@/utils/pushNotificationService";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import type { Notification } from "@/types/NotificationType";

export const initializePushNotifications = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("PushNotificationToken");
    const isGuest = await AsyncStorage.getItem("isGuest");
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    // Always allow getting the token
    if (!storedToken) {
      const token =
        await PushNotificationService.registerForPushNotifications();
      console.log("push token", token);
      if (token) await AsyncStorage.setItem("PushNotificationToken", token);
    }

    // Only send device token to backend if user is logged in
    if (isGuest !== "true" && isLoggedIn === "true") {
      const token = await AsyncStorage.getItem("PushNotificationToken");
      if (token) {
        try {
          await AuthApi.sendDeviceToken(token);
        } catch (error) {
          console.error("Failed to register token with backend:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error initializing push notifications:", error);
  }
};

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

function GlobalNotificationHandler() {
  const { user, fetchUser } = useUserStore();
  const { handleRealtimeNotification, checkNotificationStatus } =
    useNotificationStore();
  const router = useRouter();
  const appState = useRef(AppState.currentState);

  // Unified notification handler
  const handleNewNotification = useCallback(
    (newNotification: Notification) => {
      handleRealtimeNotification(newNotification);
      // checkNotificationStatus();

      showToast(
        "success",
        newNotification.notification_type ?? "Notification",
        newNotification.message ?? "You have a new notification."
      );
    },
    [handleRealtimeNotification]
  );

  useEffect(() => {
    if (!user?.id) return;

    const globalHandler = (newNotification: Notification) => {
      console.log("🌍 Global handler received notification:", newNotification);
      handleNewNotification(newNotification);
    };

    MQTTClient.connect(String(user.id), globalHandler);

    return () => {
      MQTTClient.disconnect();
    };
  }, [user?.id, handleNewNotification]);

  useEffect(() => {
    if (!user?.id) return;
    initializePushNotifications();
  }, [user?.id]);

  // Setup MQTT connection
  useEffect(() => {
    if (!user?.id) return;

    MQTTClient.connect(String(user.id), handleNewNotification);

    return () => {
      MQTTClient.disconnect();
    };
  }, [user?.id, handleNewNotification]);

  // Setup push notification listeners
  useEffect(() => {
    const notificationListener =
      PushNotificationService.addNotificationReceivedListener(
        (notification) => {
          const data = notification.request.content.data as any;

          const notificationData: Notification = {
            id: data.id || Date.now(),
            title: notification.request.content.title || "",
            message: notification.request.content.body || "",
            notification_type: data.notification_type || "general",
            data: data,
            is_read: false,
            created_at: new Date().toISOString(),
          };

          handleNewNotification(notificationData);
        }
      );

    // Handle notification interactions (taps)
    const responseListener =
      PushNotificationService.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data as any;

          // Navigate based on notification data
          if (data.order_id) {
            router.push({
              pathname: "/Screens/OrderScreen/OrderDetailsScrenn",
              params: { id: data.order_id },
            });
          }

          // Mark as read
          handleRealtimeNotification({
            id: data.id,
            title: response.notification.request.content.title || "",
            message: response.notification.request.content.body || "",
            notification_type: data.notification_type,
            data: data,
            is_read: true,
            created_at: data.created_at || new Date().toISOString(),
          });
        }
      );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [handleNewNotification, router]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active" &&
          user?.id
        ) {
          if (!MQTTClient.isClientConnected()) {
            MQTTClient.connect(String(user.id), handleNewNotification);
          }

          // Refresh notifications
          // checkNotificationStatus();
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [user?.id, handleNewNotification, checkNotificationStatus]);

  return null;
}

export default function RootLayout() {
  const { requestLocation } = useLocationStore();
  const [fontsLoaded] = useFonts({
    OrelegaOne: OrelegaOne_400Regular,
    UrbanistLight: Urbanist_300Light_Italic,
    UrbanistRegular: Urbanist_400Regular,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
    UrbanistBold: Urbanist_700Bold,
    InterRegular: Inter_400Regular,
    ManropeSemiBold: Manrope_600SemiBold,
  });
  useEffect(() => {
    if (fontsLoaded) {
      requestLocation();
    }
  }, [fontsLoaded, requestLocation]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" backgroundColor="#fff" />
          <GlobalNotificationHandler />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} swipeable={true} />
        </QueryClientProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

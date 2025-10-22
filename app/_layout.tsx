import "./global.css";
import { useEffect, useState, useCallback, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, AppState, AppStateStatus, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/toastConfig";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Notifications from "expo-notifications";

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

// Import MQTT and stores
import MQTTClient from "@/utils/mqttClient";
import PushNotificationService from "@/utils/pushNotificationService";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import type { Notification } from "@/types/NotificationType";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

// Global notification handler with both MQTT and Push
function GlobalNotificationHandler() {
  const { user, fetchUser } = useUserStore();
  const { handleRealtimeNotification, checkNotificationStatus } =
    useNotificationStore();
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Unified notification handler
  const handleNewNotification = useCallback(
    (newNotification: Notification) => {
      console.log("🔔 Notification received:", newNotification);

      handleRealtimeNotification(newNotification);
      checkNotificationStatus();

      showToast(
        "success",
        newNotification.notification_type ?? "Notification",
        newNotification.message ?? "You have a new notification."
      );
    },
    [handleRealtimeNotification, checkNotificationStatus]
  );

  // Initialize push notifications and register token
  useEffect(() => {
    if (!user?.id) {
      fetchUser();
      return;
    }

    const initializePushNotifications = async () => {
      try {
        // Check if token already exists locally
        const storedToken = await AsyncStorage.getItem("PushNotificationToken");
        const guest = await AsyncStorage.getItem("isGuest");
        if (guest === "true" || storedToken) {
          // console.log("⏩ Skipping push notification registration");
          if (storedToken) setPushToken(storedToken);
          return;
        }

        // Register for push notifications (get new token)
        const token =
          await PushNotificationService.registerForPushNotifications();

        if (token) {
          setPushToken(token);

          // Store token locally
          await AsyncStorage.setItem("PushNotificationToken", token);

          // Send token to backend
          try {
            await AuthApi.sendDeviceToken(token);
            // console.log("✅ Push token registered with backend");
          } catch (error) {
            console.error(
              "❌ Failed to register push token with backend:",
              error
            );
            // Store temporarily to retry later
            await AsyncStorage.setItem("pendingPushToken", token);
          }
        }

        // Retry any pending token if exists
        const pendingToken = await AsyncStorage.getItem("pendingPushToken");
        if (pendingToken && pendingToken !== token) {
          try {
            await AuthApi.sendDeviceToken(pendingToken);
            console.log("✅ Pending push token registered successfully");
            await AsyncStorage.removeItem("pendingPushToken");
          } catch (error) {
            console.error("❌ Failed to register pending push token:", error);
          }
        }
      } catch (error) {
        console.error("❌ Error initializing push notifications:", error);
      }
    };

    initializePushNotifications();
  }, [user?.id, fetchUser]);

  // Setup MQTT connection
  useEffect(() => {
    if (!user?.id) return;

    // console.log("🚀 Connecting to MQTT for user:", user.id);
    MQTTClient.connect(String(user.id), handleNewNotification);

    return () => {
      // console.log("🧹 Cleaning up MQTT connection");
      MQTTClient.disconnect();
    };
  }, [user?.id, handleNewNotification]);

  useEffect(() => {
    const notificationListener =
      PushNotificationService.addNotificationReceivedListener(
        (notification) => {
          // Extract notification data
          const data = notification.request.content.data as any;

          // Convert to your Notification type
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

    // Handle notification tap (when user taps on notification)
    const responseListener =
      PushNotificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log("👆 User tapped on notification:", response);

          const data = response.notification.request.content.data as any;

          // Navigate based on notification type
          if (data.order_id) {
            router.push({
              pathname: "/Screens/OrderScreen/OrderDetailsScrenn",
              params: { id: data.order_id },
            });
          }

          // Update notification as read
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

  // Handle app state changes (reconnect MQTT when coming back to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active" &&
          user?.id
        ) {
          // Reconnect MQTT if disconnected
          if (!MQTTClient.isClientConnected()) {
            // console.log("🔌 Reconnecting MQTT...");
            MQTTClient.connect(String(user.id), handleNewNotification);
          }

          // Refresh notifications
          checkNotificationStatus();
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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  async function requestNotificationPermission() {
    if (Platform.OS === "android") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Notification permissions not granted!");
      }
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const guest = await AsyncStorage.getItem("isLoggedIn");

      setIsLoggedIn(!!token || guest === "true");

      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
      await requestNotificationPermission();
    };
    checkAuth();
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoggedIn === null) return null;

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" backgroundColor="#fff" />

          {isLoggedIn && <GlobalNotificationHandler />}

          <Stack screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Stack.Screen
                name="(tabs)/_layout"
                options={{ gestureEnabled: false, headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="/onboarding"
                options={{ gestureEnabled: true, headerShown: false }}
              />
            )}
          </Stack>

          <Toast config={toastConfig} />
        </QueryClientProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

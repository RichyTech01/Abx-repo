import "./global.css";
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/toastConfig";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";

import {
  useFonts,
  OrelegaOne_400Regular,
} from "@expo-google-fonts/orelega-one";
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope";

// Import MQTT and stores
import MQTTClient from "@/utils/mqttClient";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import showToast from "@/utils/showToast";
import type { Notification } from "@/types/NotificationType";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

// 🔔 Global MQTT handler (same as yours)
function GlobalMQTTHandler() {
  const { user, fetchUser } = useUserStore();
  const { handleRealtimeNotification } = useNotificationStore();

  const handleNewNotification = useCallback(
    (newNotification: Notification) => {
      console.log("🔔 Global notification received:", newNotification);

      handleRealtimeNotification(newNotification);

      showToast(
        "success",
        newNotification.notification_type ?? "Notification",
        newNotification.message ?? "You have a new notification."
      );
    },
    [handleRealtimeNotification]
  );

  useEffect(() => {
    if (!user) {
      fetchUser();
      return;
    }

    if (user?.id) {
      console.log("🚀 Connecting to global MQTT for user:", user.id);
      MQTTClient.connect(String(user.id), handleNewNotification);
    }

    return () => {
      console.log("🧹 Cleaning up global MQTT connection");
      MQTTClient.disconnect();
    };
  }, [user?.id, handleNewNotification, fetchUser]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OrelegaOne: OrelegaOne_400Regular,
    UrbanistRegular: Urbanist_400Regular,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
    UrbanistBold: Urbanist_700Bold,
    InterRegular: Inter_400Regular,
    ManropeSemiBold: Manrope_600SemiBold,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const guest = await AsyncStorage.getItem("isLoggedIn");

      setIsLoggedIn(!!token || guest === "true");

      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, [fontsLoaded]);

  console.log(
    "🏠 Current state - isLoggedIn:",
    isLoggedIn,
    "fontsLoaded:",
    fontsLoaded
  );

  if (!fontsLoaded || isLoggedIn === null) return null;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {!fontsLoaded || isLoggedIn === null ? (
        <View style={{ flex: 1, backgroundColor: "#FFF6F2" }} />
      ) : (
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="dark" backgroundColor="#fff" />

            {isLoggedIn && <GlobalMQTTHandler />}

            <Stack screenOptions={{ headerShown: false }}>
              {isLoggedIn ? (
                <Stack.Screen
                  name="(tabs)/_layout"
                  options={{ gestureEnabled: false, headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="(auth)/onboarding"
                  options={{ gestureEnabled: true, headerShown: false }}
                />
              )}
            </Stack>

            <Toast config={toastConfig} />
          </QueryClientProvider>
        </StripeProvider>
      )}
    </SafeAreaProvider>
  );
}

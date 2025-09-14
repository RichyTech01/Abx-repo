import "./global.css";
// import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
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
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

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
      setIsLoggedIn(!!token);

      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoggedIn === null) return null;

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#fff" />
          <Stack
            screenOptions={{
              // Global screen options
              headerShown: false,
            }}
          >
            {isLoggedIn ? (
              <Stack.Screen
                name="(tabs)/_layout"
                options={{ 
                  gestureEnabled: false, // Explicitly disable for tabs
                  headerShown: false 
                }}
              />
            ) : (
              <Stack.Screen
                name="(auth)/onboarding"
                options={{ 
                  gestureEnabled: true, // Allow gestures in auth flow if needed
                  headerShown: false 
                }}
              />
            )}
          </Stack>

          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}

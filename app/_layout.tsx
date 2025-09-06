import "./global.css";
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
import {
  Inter_400Regular,
} from "@expo-google-fonts/inter";

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toastConfig } from "@/toastConfig";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OrelegaOne: OrelegaOne_400Regular,
    UrbanistRegular: Urbanist_400Regular,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
    UrbanistBold: Urbanist_700Bold,
    InterRegular: Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51RARqlRueoJLqZydZsbUAZa0wbo6okPcMTKWWKIVgRYTH1wHSSmC3GChQf2oInN5bbKo4LeXtXITxIUmT36tTa8v00Fy0PMDMN">
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#fff" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}

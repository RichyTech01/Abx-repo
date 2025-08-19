import "./global.css";
import { useFonts, OrelegaOne_400Regular } from "@expo-google-fonts/orelega-one";
import { Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold } from "@expo-google-fonts/urbanist";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OrelegaOne: OrelegaOne_400Regular,
    UrbanistRegular: Urbanist_400Regular,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
    UrbanistBold: Urbanist_700Bold,
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
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

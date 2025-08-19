import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Keep splash screen visible
        await SplashScreen.preventAutoHideAsync();

        // Simulate async auth check
        await new Promise((res) => setTimeout(res, 1000));
        const loggedIn = false; // or true if user is logged in
        setIsLoggedIn(loggedIn);

        // Navigate to the correct screen
        if (loggedIn) {
          router.replace("/(tabs)/Home");
        } else {
          router.replace("/onboarding");
        }
      } finally {
        // Hide splash after navigation
        await SplashScreen.hideAsync();
      }
    };

    checkUser();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return null;
}

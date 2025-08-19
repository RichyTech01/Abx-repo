import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        await new Promise((res) => setTimeout(res, 1000));
        const loggedIn = false; 
        setIsLoggedIn(loggedIn);

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

import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedIn = false; 
        if (loggedIn) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/(tabs)");
      } finally {
        setIsCheckingAuth(false);
        await SplashScreen.hideAsync();
      }
    };

    checkUser();
  }, []);

  if (isCheckingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}

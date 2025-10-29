// index.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, Image } from "react-native";
import Storage from "@/utils/Storage";

export default function Index() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await Storage.get("accessToken");
        const guest = await Storage.get("isGuest");
        const isloggedIn = await Storage.get("isLoggedIn");

        const authenticated =
          !!token || !!guest || isloggedIn === "true";

        // Small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use replace instead of Redirect
        if (authenticated) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }

        // Hide splash after navigation
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 150);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/(auth)");
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 150);
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="flex-1 bg-[#0C513F]">
      <Image
        source={require("../assets/Images/splash.png")}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        }}
      />
    </View>
  );
}

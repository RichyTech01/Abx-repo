import { useRouter,  } from "expo-router";
import { useEffect,  } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, Image } from "react-native";
import Storage from "@/utils/Storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await Storage.get("accessToken");
        const guest = await Storage.get("isGuest");
        const isloggedIn = await Storage.get("isLoggedIn");

        const authenticated = !!token || !!guest || isloggedIn === "true";

        if (authenticated) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/OnboardingScreen");
        }

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/(auth)/OnboardingScreen");
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 150);
      } finally {
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

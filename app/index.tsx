import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        const accessToken = await AsyncStorage.getItem("accessToken");

        if (accessToken) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/onboarding");
      } finally {
        setIsCheckingAuth(false);
        await SplashScreen.hideAsync();
      }
    };

    checkUser();
  }, [router]); 

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
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return null;
}

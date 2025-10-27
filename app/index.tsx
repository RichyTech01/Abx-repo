import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import Storage from "@/utils/Storage";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await Storage.get("accessToken");
        const guest = await Storage.get("isGuest");
        const isloggedIn = await Storage.get("isLoggedIn");

        const authenticated =
          !!token || guest === "true" || isloggedIn === "true";

        setLoggedIn(authenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, []);

  if (!ready) {
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

  return loggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}

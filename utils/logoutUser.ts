import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export const logoutUser = async (router: ReturnType<typeof useRouter>) => {
  try {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "cartId", ]);

    router.replace("/onboarding");

  } catch (err) {
    console.error("Failed to log out:", err);
  }
};

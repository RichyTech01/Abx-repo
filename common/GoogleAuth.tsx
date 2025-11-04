import { Pressable, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/useUserStore";
import GoogleIcon from "@/assets/svgs/GoogleIcon";

interface Props {
  buttonText?: string;
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

const GoogleAuth: React.FC<Props> = ({
  buttonText = "Continue with Google",
}) => {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, 
      offlineAccess: false,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();

      // Sign in and get user info
      await GoogleSignin.signIn();

      // Retrieve tokens (idToken/accessToken) separately to satisfy typings
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error("No ID token received");
      }

      // Send to your backend
      const res = await AuthApi.googleSignIn({ token: idToken });

      await AsyncStorage.setItem("accessToken", res.access);
      await AsyncStorage.setItem("refreshToken", res.refresh);

      if (res.is_first_login === true) {
        router.push("/AdditionalInfo/AdditionalInfo");
      } else {
        await AsyncStorage.setItem("isLoggedIn", "true");
        fetchUser();
        router.replace("/(tabs)");
        showToast("success", "Logged in successfully!");
      }
    } catch (error: any) {
      console.log("Google sign-in error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in
        showToast("info", "Sign-in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in already in progress
        showToast("info", "Sign-in in progress...");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        showToast("error", "Google Play Services not available");
      } else {
        const errorMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Google sign-in failed.";
        showToast("error", errorMessage);
      }
    }
  };

  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]"
      onPress={handleGoogleSignIn}
    >
      <GoogleIcon />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default GoogleAuth;

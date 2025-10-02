import { Pressable, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
// import * as AuthSession from "expo-auth-session";
import { useUserStore } from "@/store/useUserStore";

import GoogleIcon from "@/assets/svgs/GoogleIcon";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  buttonText?: string;
}

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;

const GoogleAuth: React.FC<Props> = ({
  buttonText = "Continue with Google",
}) => {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });
  // console.log(AuthSession.makeRedirectUri());

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === "error") {
      console.log("Google auth error:", response.error);
      showToast("error", "Google authentication failed.");
    }
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    setIsLoading(true);
    try {
      // Call your existing backend endpoint
      const res = await AuthApi.googleSignIn({ token });

      // Store tokens
      await AsyncStorage.setItem("accessToken", res.access);
      await AsyncStorage.setItem("refreshToken", res.refresh);
      if (res.is_first_login === true) {
        router.push("/AdditionalInfo/AdditionalInfo");
      } else {
        await AsyncStorage.setItem("isLoggedIn", "true");
        fetchUser();
        router.dismissAll();
        router.replace("/(tabs)");
        showToast("success", "Logged in successfully!");
      }
    } catch (err: any) {
      console.log("Google sign-in error:", err);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Google sign-in failed.";

      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]"
      onPress={() => promptAsync()}
      disabled={!request || isLoading}
    >
      <GoogleIcon />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default GoogleAuth;

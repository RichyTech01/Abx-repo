import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
// import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AuthApi from "@/api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import showToast from "@/utils/showToast";
import GoogleIcon from "@/assets/svgs/GoogleIcon";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  buttonText?: string;
}

const GoogleAuth: React.FC<Props> = ({ buttonText = "Continue with Google" }) => {
  const router = useRouter();

  // Configure Google login
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "<YOUR_GOOGLE_CLIENT_ID>", // Replace with your actual client ID
  });

  // Handle Google login response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    try {
      const res = await AuthApi.googleSignIn({ token });
      const { access, refresh } = res;

      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);

      showToast("success", "Logged in successfully!");
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      console.log("Google sign-in error:", err);
      showToast("error", "Google sign-in failed.");
    }
  };

  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]"
      onPress={() => promptAsync()}
    >
      <GoogleIcon />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText} with Google
      </Text>
    </Pressable>
  );
};

export default GoogleAuth;

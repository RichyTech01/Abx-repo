import { Pressable, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthApi from "@/api/AuthApi";
import GoogleIcon from "@/assets/svgs/GoogleIcon";
import showToast from "@/utils/showToast";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  buttonText?: string;
}

const GoogleAuth: React.FC<Props> = ({ buttonText = "Continue with Google" }) => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with your actual client ID
    // For Android, you might also need:
    // androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    // For iOS, you might also need:
    // iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  });

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
    try {
      // Call backend endpoint
      const res = await AuthApi.googleSignIn({ token });
      const { access, refresh } = res;

      // Store tokens
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);

      showToast("success", "Logged in successfully!");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Google sign-in error:", err);
      showToast("error", "Google sign-in failed.");
    }
  };

  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]"
      onPress={() => {
        promptAsync();
      }}
      disabled={!request} 
    >
      <GoogleIcon />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default GoogleAuth;
import { Pressable, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/useUserStore";
import GoogleIcon from "@/assets/svgs/GoogleIcon";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  buttonText?: string;
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;

const GoogleAuth: React.FC<Props> = ({
  buttonText = "Continue with Google",
}) => {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleResponse(id_token);
    }
  }, [response]);

  const handleGoogleResponse = async (idToken: string) => {
    try {
      const res = await AuthApi.googleSignIn({ token: idToken });

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
    } catch (error: any) {
      console.log("Google sign-in error:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Google sign-in failed.";
      showToast("error", errorMessage);
    }
  };

  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]"
      onPress={() => promptAsync()}
      disabled={!request}
      style={{ opacity: !request ? 0.5 : 1 }}
    >
      <GoogleIcon />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default GoogleAuth;

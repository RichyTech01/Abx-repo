import { Pressable, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/useUserStore";
// import AppleIcon from "@/assets/svgs/AppleIcon";

interface Props {
  buttonText?: string;
}

const AppleAuth: React.FC<Props> = ({ buttonText = "Continue with Apple" }) => {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const handleAppleSignIn = async () => {
    try {
      // Check if Apple Authentication is available on this device
      const isAvailable = await AppleAuthentication.isAvailableAsync();

      if (!isAvailable) {
        showToast("error", "Apple Sign-In is not available on this device");
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple Credential Response:", {
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName,
        authorizationCode: credential.authorizationCode ? "present" : "missing",
        identityToken: credential.identityToken ? "present" : "missing",
      });

      const identityToken = credential.identityToken;
      if (!identityToken) {
        showToast("error", "No identity token received from Apple");
        return;
      }

      let fullName = "";
      if (credential.fullName) {
        const { givenName, familyName } = credential.fullName;
        fullName = [givenName, familyName].filter(Boolean).join(" ");
      }

      // Always send a string (even empty) to backend
      const payload = {
        identity_token: identityToken,
        full_name: fullName, // never undefined
      };

      console.log("Sending payload:", payload);

      const res = await AuthApi.appleSignIn(payload);

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
      console.error("Apple Sign-In Error:", error);
      console.error("Error Details:", {
        code: error.code,
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });

      if (error.code === "ERR_REQUEST_CANCELED") {
        showToast("info", "Sign-in cancelled");
      } else if (error.code === "ERR_REQUEST_FAILED") {
        showToast("error", "Apple sign-in request failed");
      } else if (error.code === "ERR_INVALID_RESPONSE") {
        showToast("error", "Invalid response from Apple");
      } else if (error?.response?.status === 401) {
        showToast("error", "Authentication failed. Please try again.");
      } else {
        const errorMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Apple sign-in failed";
        showToast("error", errorMessage);
      }
    }
  };

  return (
    <Pressable
      className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[10px]"
      onPress={handleAppleSignIn}
    >
      <Image
        source={require("../assets/Images/AppleLogo.png")}
         style={{ width: 30, height: 30 }}
 
      />
      <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default AppleAuth;

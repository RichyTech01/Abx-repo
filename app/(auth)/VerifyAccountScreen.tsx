import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Resetpassheader from "@/common/Resetpassheader";
import OTPInput from "@/common/OTPInput";
import { useLocalSearchParams } from "expo-router";
import VerificationSuccessModal from "@/Modals/AuthModals/VerificationSuccessModal";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/useUserStore";

export default function VerifyAccountScreen() {
  const { fetchUser } = useUserStore();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleOtpComplete = async (otp: string) => {
    setLoading(true);
    try {
      const res = await AuthApi.verifyEmail({ otp });
      console.log("Verification success:", res);

      // Only proceed if tokens (or success response) exist
      if (res?.access && res?.refresh) {
        await AsyncStorage.setItem("accessToken", res.access);
        await AsyncStorage.setItem("refreshToken", res.refresh);

        showToast("success", "Your email has been verified!");
        setShowModal(true);
      } else {
        showToast("error", "Verification failed, please try again.");
      }
    } catch (err: any) {
      console.log("Verification error:", err?.response?.data || err.message);
      showToast("error", "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showToast("error", "Email is missing.");
      return;
    }

    try {
      setResending(true);
      await AuthApi.resendOtp(email);
      showToast(
        "success",
        "Success",
        "A new code has been sent to your email."
      );
    } catch (err: any) {
      console.log("Resend error:", err?.response?.data || err.message);
      showToast("error", "Failed to resend code. Try again later.");
    } finally {
      setResending(false);
    }
  };
  const handleLogin = async () => {
    try {
      // Check if tokens exist already
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        console.log("⚠️ No tokens found, user may not be fully logged in yet.");
      }
      await AsyncStorage.removeItem("cartId");
      await AsyncStorage.setItem("isLoggedIn", "true");
      fetchUser();

      setShowModal(false);
      router.dismissAll();
      router.replace("/(tabs)");
    } catch (err) {
      console.log("Login handling error:", err);
    }
  };

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-[20px] flex-1">
            <Resetpassheader
              HeaderText="Verify your account"
              SubHeaderText="Please enter the 6 digit code sent to"
            />

            <Text className="text-[#0C513F] text-[16px] leading-[25px] font-urbanist text-center">
              {email}
            </Text>

            <View className="mt-[20px]">
              <OTPInput onComplete={handleOtpComplete} />
            </View>

            {loading && (
              <View className="mt-[20px] items-center">
                <ActivityIndicator size="small" color="#0C513F" />
              </View>
            )}

            <View className="flex-row items-center justify-center mt-[32px] flex-wrap">
              <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
                Didn&apos;t receive a code?{" "}
              </Text>
              <Pressable onPress={handleResendCode} disabled={resending}>
                <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                  {"Resend code"}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center justify-center mt-[4%] flex-wrap">
              <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
                Still having issues getting your code?
              </Text>
              <Pressable onPress={() => {}}>
                <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                  Contact our support team
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showModal && (
        <VerificationSuccessModal visible={showModal} onPress={handleLogin} />
      )}
    </ScreenWrapper>
  );
}

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Resetpassheader from "@/common/Resetpassheader";
import OTPInput from "@/common/OTPInput";
import { useRouter, useLocalSearchParams } from "expo-router";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";

export default function EnterResetCode() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams();
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;
  const [, setOtp] = useState("");

  const handleOtpComplete = useCallback(
    async (code: string) => {
      if (!email) {
        showToast("error", "Email not found.");
        return;
      }
      try {
        await AuthApi.confirmResetCode({ otp: code });
      } catch (err: any) {
        console.log("OTP verification error:", err);
        console.log("Error response data:", err.response?.data); // See actual API error
        console.log("Error status:", err.response?.status);

        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid code";
        showToast("error", errorMessage);
        return;
      }

      // Only navigate if verification succeeded
      try {
        router.push(
          `/CreatenewPassWord?email=${encodeURIComponent(
            email
          )}&code=${encodeURIComponent(code)}`
        );
      } catch (navErr) {
        console.log("Navigation error:", navErr);
      }
    },
    [email, router]
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Resetpassheader
            HeaderText="Enter Reset Code"
            SubHeaderText="Please enter the 6 digit code sent to"
          />
          <Text className="text-[#0C513F] text-[16px] leading-[25px] font-urbanist text-center mt-[8px]">
            {email || "your email"}
          </Text>

          <View className="mt-[32px]">
            <OTPInput
              length={6}
              onComplete={(code: string) => {
                setOtp(code);
                handleOtpComplete(code);
              }}
            />
          </View>

          <View className="flex-row items-center justify-center mt-[8%] flex-wrap">
            <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
              Didn&apos;t receive a code?{" "}
            </Text>
            <Pressable
              onPress={async () => {
                if (!email) return;
                try {
                  await AuthApi.resendOtp(email as string);
                  showToast("success", "OTP resent successfully!");
                } catch (err: any) {
                  console.log("Resend OTP error:", err);
                  showToast("error", err.detail || "Could not resend OTP");
                }
              }}
            >
              <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                Resend code
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-center mt-[4%] flex-wrap">
            <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
              Still having issues getting your code?
            </Text>
            <Pressable onPress={() => router.push("/Support")}>
              <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                Contact our support team
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

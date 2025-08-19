import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Resetpassheader from "@/common/Resetpassheader";
import OTPInput from "@/common/OTPInput";
import { useRouter, useLocalSearchParams } from "expo-router";
import AuthApi from "@/api/AuthApi";

export default function EnterResetCode() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams();
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam; 
  const [otp, setOtp] = useState("");

const handleOtpComplete = async (code: string) => {
  if (!email) {
    Alert.alert("Error", "Email not found.");
    return;
  }

  try {
    // Confirm OTP
    await AuthApi.confirmResetCode({ email, otp_code: code });

    router.push(
      `/CreateNewPassword?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}` as never
    );
  } catch (err: any) {
    console.log("OTP verification error:", err);
    Alert.alert("Error", err.detail || "Invalid code");
  }
};


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
                  Alert.alert("Success", "OTP resent successfully!");
                } catch (err: any) {
                  console.log("Resend OTP error:", err);
                  Alert.alert("Error", err.detail || "Could not resend OTP");
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

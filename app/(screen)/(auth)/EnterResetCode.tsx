import React from "react";
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
import OtpInput from "@/common/OTPInput";
import { useRouter } from "expo-router";

export default function EnterResetCode() {

    const router = useRouter();

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{  justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Resetpassheader
            HeaderText="Enter Reset Code"
            SubHeaderText="Please enter the 6 digit code sent to"
          />
          <Text className="text-[#0C513F] text-[16px] leading-[25px] font-urbanist text-center mt-[8px]">
            angelaisstriving@gmail.com
          </Text>

          <View className="mt-[32px]">
            <OtpInput />
          </View>

          <View className="flex-row items-center justify-center mt-[8%] flex-wrap">
            <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
              Didn&apos;t receive a code?{" "}
            </Text>
            <Pressable onPress={() => console.log("Resend code pressed")}>
              <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                Resend code
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-center mt-[4%] flex-wrap">
            <Text className="text-[14px] leading-[20px] font-urbanist text-[#4A3223] flex-shrink">
              Still having issues getting your code?
            </Text>
            <Pressable onPress={() => router.push("/CreatenewPassWord")}>
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

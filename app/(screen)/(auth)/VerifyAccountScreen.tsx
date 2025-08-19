import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Resetpassheader from "@/common/Resetpassheader";
import OTPInput from "@/common/OTPInput";
import { useRouter } from "expo-router";
import VerificationSuccessModal from "@/Modals/AuthModals/VerificationSuccessModal";

export default function VerifyAccountScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80} // adjust if header overlaps input
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

            <Text className="text-[#0C513F] text-[16px] leading-[25px] font-urbanist text-center ">
              angelaisstriving@gmail.com
            </Text>

            <View className="mt-[20px]">
              <OTPInput />
            </View>

            <View className="flex-row items-center justify-center mt-[32px] flex-wrap">
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
              <Pressable onPress={() => setShowModal((prev) => !prev)}>
                <Text className="text-[14px] leading-[20px] font-urbanist text-[#0C513F] ml-[4px]">
                  Contact our support team
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showModal && (
        <VerificationSuccessModal
          onClose={() => setShowModal((prev) => !prev)}
          visible={showModal}
        />
      )}
    </SafeAreaView>
  );
}

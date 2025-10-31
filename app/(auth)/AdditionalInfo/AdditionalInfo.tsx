import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import AuthAdditionalInfoHeader from "@/common/AuthAdditionalInfoHeader";
import AdditionalinfoStepOne from "./AdditionalinfoStepOne";
import AdditionalinfoStepTwo from "./AdditionalinfoStepTwo";
// import AuthApi from "@/api/AuthApi";
// import showToast from "@/utils/showToast";
import { useRouter } from "expo-router";

export default function AdditionalInfo() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  // const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState({
  //   phone_number: "",
  // });

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };
  const goBackStep = () => {
    if (step == 2) setStep(step - 1);
  };

  // const handleSignUp = async () => {
  //   try {
  //     if (!formData.phone_number) {
  //       showToast("error", "Phone number is required");
  //       return;
  //     }
  //     setLoading(true);

  //     console.log("Submitting signup payload:", formData);
  //     const res = await AuthApi.updatePhoneNumber(formData);
  //     console.log("Sign up success:", res);
  //     showToast("success", "Your account has been created!");
  //     router.replace("/(tabs)");
  //   } catch (error: any) {
  //     console.log("Sign up error:", error?.response?.data || error.message);

  //     const errorData = error?.response?.data;
  //     if (errorData) {
  //       if (errorData.phone_number) {
  //         showToast(
  //           "error",
  //           `Phone number error: ${errorData.phone_number[0]}`
  //         );
  //       } else if (errorData.user_address?.post_code) {
  //         showToast(
  //           "error",
  //           `Post code error: ${errorData.user_address.post_code[0]}`
  //         );
  //       } else {
  //         showToast("error", errorData.message || "Sign up failed");
  //       }
  //     } else {
  //       showToast("error", "Sign up failed");
  //     }
  //   }
  //   setLoading(false);
  // };

  //   updatePhoneNumber
  return (
    <ScreenWrapper style={{ backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthAdditionalInfoHeader />

          <View className="mx-[20px] mt-[35px]">
            <View className="rounded-[16px] border border-[#F1EAE7] w-[53px] py-[4px] items-center justify-center flex-row">
              <Text
                className="text-[16px] leading-[22px] font-urbanist-semibold"
                style={{ color: "#0C513F" }}
              >
                {step}/2
              </Text>
            </View>

            {step === 1 && <AdditionalinfoStepOne nextStep={nextStep} />}
            {step === 2 && <AdditionalinfoStepTwo goBackStep={goBackStep} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

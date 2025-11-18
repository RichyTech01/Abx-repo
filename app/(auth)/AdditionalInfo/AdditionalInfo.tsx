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
import { useRouter } from "expo-router";

export default function AdditionalInfo() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };
  const goBackStep = () => {
    if (step == 2) setStep(step - 1);
  };

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
                {step}
              </Text>
              <Text
                className="text-[16px] leading-[22px] font-urbanist-semibold"
                style={{ color: step === 2 ? "#0C513F" : "#AEC5BF" }}
              >
                /2
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

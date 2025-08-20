import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Authheader from "@/common/Authheader";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

export default function CreateAccount() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Authheader
              name="Login"
              Subtext="Already have an account?"
              HeaderText="Create your account"
            />

            <View className="mx-[20px] mt-[35px]">
              {/* Step indicator */}
              <View className="rounded-[16px] border border-[#F1EAE7] w-[53px] py-[4px] items-center justify-center flex-row">
                <Text
                  className="text-[16px] leading-[22px] font-urbanist-semibold"
                  style={{ color: step === 1 ? "#0C513F" : "#0C513F" }}
                >
                  {step === 1 ? 1 : 2}
                </Text>
                <Text
                  className="text-[16px] leading-[22px] font-urbanist-semibold"
                  style={{ color: "#0C513F" }}
                >
                  /
                </Text>
                <Text
                  className="text-[16px] leading-[22px] font-urbanist-semibold"
                  style={{ color: step === 2 ? "#0C513F" : "#AEC5BF" }}
                >
                  2
                </Text>
              </View>

              {/* Steps */}
              <View>{step === 1 && <StepOne nextStep={nextStep} />}</View>
              <View>{step === 2 && <StepTwo />}</View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

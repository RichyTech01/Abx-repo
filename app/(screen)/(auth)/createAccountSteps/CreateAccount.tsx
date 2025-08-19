import React, { useState } from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";
import Authheader from "@/common/Authheader";
import StepOne from "./StepOne";

export default function CreateAccount() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <SafeAreaView className="bg-white flex-1 ">
      <View>
        <Authheader
          name="Login"
          Subtext="Already have an account?"
          HeaderText="Create your account"
        />

        <View className="mx-[20px] mt-[35px] ">
          <View className="rounded-[16px] border border-[#F1EAE7] w-[53px] py-[4px] items-center justify-center flex-row">
            <Text
              className="text-[16px] leading-[22px]"
              style={{ color: step === 1 ? "#0C513F" : "#AEC5BF" }}
            >
              1
            </Text>
            <Text
              className="text-[16px] leading-[22px]"
              style={{ color: step === 1 ? "#0C513F" : "#0C513F" }}
            >
              /
            </Text>
            <Text
              className="text-[16px] leading-[22px]"
              style={{ color: step === 2 ? "#0C513F" : "#AEC5BF" }}
            >
              2
            </Text>
          </View>

          <View>{step === 1 && <StepOne />}</View>
          <View>{step === 2 && <StepOne />}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import Authheader from "@/common/Authheader";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/common/ScreenWrapper";

export default function CreateAccount() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    user_address: {
      addr: "",
      post_code: "",
      city: "",
    },
    password: "",
  });

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };
  const goBackStep = () => {
    if (step == 2) setStep(step - 1);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      if (formData.user_address.post_code.length > 10) {
        showToast("error", "Post code must be 10 characters or less");
        return;
      }

      if (!formData.phone_number) {
        showToast("error", "Phone number is required");
        return;
      }

      console.log("Submitting signup payload:", formData);
      const res = await AuthApi.signUp(formData);
      console.log("Sign up success:", res);
      showToast("success", "Your account has been created!");
      router.push({
        pathname: "/VerifyAccountScreen",
        params: { email: formData.email }, 
      });
    } catch (error: any) {
      console.log("Sign up error:", error?.response?.data || error.message);

      const errorData = error?.response?.data;
      if (errorData) {
        if (errorData.phone_number) {
          showToast(
            "error",
            `Phone number error: ${errorData.phone_number[0]}`
          );
        } else if (errorData.user_address?.post_code) {
          showToast(
            "error",
            `Post code error: ${errorData.user_address.post_code[0]}`
          );
        } else {
          showToast("error", errorData.message || "Sign up failed");
        }
      } else {
        showToast("error", "Sign up failed");
      }
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="">
            <Authheader
              name="Login"
              Subtext="Already have an account?"
              HeaderText="Create your account"
              googleSignName="Continue"
            />

            <View className="mx-[20px] mt-[35px]">
              <View className="rounded-[16px] border border-[#F1EAE7] w-[53px] py-[4px] items-center justify-center flex-row">
                <Text
                  className="text-[16px] leading-[22px] font-urbanist-semibold"
                  style={{ color: "#0C513F" }}
                >
                  {step}/2
                </Text>
              </View>

              {step === 1 && (
                <StepOne
                  nextStep={nextStep}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {step === 2 && (
                <StepTwo
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSignUp}
                  loading={loading}
                  goBackStep={goBackStep}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

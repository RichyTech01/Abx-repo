import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import Resetpassheader from "@/common/Resetpassheader";
import { useRouter } from "expo-router";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";


export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetCode = async () => {
    if (!email) {
      showToast("error", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await AuthApi.forgotPassword(email);

      showToast("success", "Reset code sent! Check your email.");
      router.push(`/EnterResetCode?email=${email}`);
    } catch (err: any) {
      console.log("Forgot password error:", err);
      showToast("error", err.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Resetpassheader
            HeaderText="Forgot your password?"
            SubHeaderText="Enter the email address you signed up with below and we'll send you a code to help reset your password."
          />

          <View className="mt-[9%] w-full">
            <CustomTextInput
              label="Email Address"
              placeholder="Type your email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="w-full mt-[11%]">
            <Button
              title={loading ? "Sending..." : "Send reset code"}
              onPress={handleSendResetCode}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import React from "react";
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

export default function ForgotPasswordScreen() {

    const router = useRouter();

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
            />
          </View>

          <View className="w-full mt-[11%]">
            <Button title="Send reset code" onPress={() => router.push("/EnterResetCode")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

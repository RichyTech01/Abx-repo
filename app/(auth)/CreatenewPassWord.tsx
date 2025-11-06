import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Resetpassheader from "@/common/Resetpassheader";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import ResetPasswordModal from "@/Modals/AuthModals/ResetPasswordModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import showToast from "@/utils/showToast";
import AuthApi from "@/api/AuthApi";

export default function CreateNewPassword() {
  const router = useRouter();
  const { email: emailParam, code: tokenParam } = useLocalSearchParams();
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setloading] = useState(false);

  console.log(email, token);

  const handleResetPassword = async () => {
    if (!email || !token) {
      showToast("error", "Email or token is missing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }

    if (newPassword.length < 5) {
      showToast("error", "Password must be at least 5 characters.");
      return;
    }

    setloading(true);

    try {
      await AuthApi.setNewPassword({
        email,
        code: token,
        password: newPassword,
        confirm_password: confirmPassword,
      });

      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        router.dismiss(3);
      }, 1000);
    } catch (err: any) {
      console.log("Reset password error:", err);
      console.log("Error response:", err.response?.data);

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.confirm_password?.[0] ||
        err.response?.data?.code?.[0] ||
        "Could not reset password";

      showToast("error", errorMessage);
    }
    setloading(false);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full mx-auto">
            <Resetpassheader
              HeaderText="Create new password"
              SubHeaderText="Create a new password to continue enjoying our amazing services."
            />

            <View className="my-[32px]">
              <CustomTextInput
                label="New Password"
                placeholder="Use a minimum of 7 characters"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <View className="mt-[16px]">
                <CustomTextInput
                  label="Confirm Password"
                  placeholder="Use a minimum of 7 characters"
                  isPassword
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <Button
              title="Reset password"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading || !newPassword || !confirmPassword}
            />
          </View>
        </ScrollView>

        <ResetPasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

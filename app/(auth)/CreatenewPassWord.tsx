import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Resetpassheader from "@/common/Resetpassheader";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import ResetPasswordModal from "@/Modals/AuthModals/ResetPasswordModal";
import { useLocalSearchParams } from "expo-router";
import AuthApi from "@/api/AuthApi";

export default function CreateNewPassword() {
  const { email: emailParam, token: tokenParam } = useLocalSearchParams();
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !token) {
      Alert.alert("Error", "Email or token is missing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await AuthApi.setNewPassword({
        email,
        token,
        new_password: newPassword,
      });

      setModalVisible(true);
    } catch (err: any) {
      console.log("Reset password error:", err);
      Alert.alert("Error", err.detail || "Could not reset password");
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 40 }}
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

            <Button title="Reset password" onPress={handleResetPassword} />
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

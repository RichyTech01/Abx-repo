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


export default function CreateNewPassword() {
  const [modalVisible, setModalVisible] = useState(false);

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
              />
              <View className="mt-[16px]">
                <CustomTextInput
                  label="Confirm Password"
                  placeholder="Use a minimum of 7 characters"
                  isPassword
                />
              </View>
            </View>

            <Button title="Reset password" onPress={() => setModalVisible(true)} />
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

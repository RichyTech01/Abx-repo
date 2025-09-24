import { View, ScrollView, Alert } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import { useState } from "react";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const disable = !currentPassword || !newPassword || !confirmPassword;

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!currentPassword.trim())
      newErrors.currentPassword = "Enter your current password";
    if (!newPassword.trim()) newErrors.newPassword = "Enter a new password";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm your new password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await AuthApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });
      showToast("success", "Password changed successfully!");
      navigation.goBack();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err: any) {
      console.log("Full error response:", err.response?.data);

      const backendErrors = err.response?.data || {};
      const fieldErrors: typeof errors = {};

      if (backendErrors.current_password) {
        fieldErrors.currentPassword = backendErrors.current_password[0];
      }
      if (backendErrors.new_password) {
        fieldErrors.newPassword = backendErrors.new_password[0];
      }
      if (backendErrors.confirm_new_password) {
        fieldErrors.confirmPassword = backendErrors.confirm_new_password[0];
      }
      if (backendErrors.non_field_errors) {
        fieldErrors.currentPassword = backendErrors.non_field_errors[0];
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          "Something went wrong while changing password";
        showToast("error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Change password" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border border-[#F1EAE7] rounded-[16px] mt-[10%] py-[30.5px] px-[20px] mx-[20px]">
          <View className="gap-[16px]">
            <CustomTextInput
              label="Current password"
              placeholder="Enter current password"
              isPassword
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword)
                  setErrors({ ...errors, currentPassword: undefined });
              }}
              error={errors.currentPassword}
            />
            <CustomTextInput
              label="New password"
              placeholder="Enter new password"
              isPassword
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword)
                  setErrors({ ...errors, newPassword: undefined });
              }}
              error={errors.newPassword}
            />
            <CustomTextInput
              label="Confirm new password"
              placeholder="Confirm new password"
              isPassword
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
            />
          </View>

          <View className="mt-[40px]">
            <Button
              title={"Save changes"}
              onPress={handleSave}
              paddingVertical={10}
              borderWidth={0}
              loading={loading}
              disabled={disable}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

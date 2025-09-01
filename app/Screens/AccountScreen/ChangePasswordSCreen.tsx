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

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords do not match!");
      return;
    }

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
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.non_field_errors?.[0] || "Something went wrong"
      );
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
              onChangeText={setCurrentPassword}
            />
            <CustomTextInput
              label="New password"
              placeholder="Enter new password"
              isPassword
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <CustomTextInput
              label="Confirm new password"
              placeholder="Confirm new password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View className="mt-[40px]">
            <Button
              title={"Save changes"}
              onPress={handleSave}
              paddingVertical={10}
              borderWidth={0}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

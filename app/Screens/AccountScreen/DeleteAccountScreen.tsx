import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/common/Header";
import UrbanistText from "@/common/UrbanistText";
import { useUserStore } from "@/store/useUserStore";
import ScreenWrapper from "@/common/ScreenWrapper";
import CustomTextInput from "@/common/CustomTextInput";
import LogoutModal from "@/Modals/LogoutModal";
import AuthApi from "@/api/AuthApi";
import { logoutUser } from "@/utils/logoutUser";
import Button from "@/common/Button";
import showToast from "@/utils/showToast";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { user } = useUserStore();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validatePassword = () => {
    if (!password) {
      setError({ password: "Password is required" });
      return false;
    }
    if (password.length < 7) {
      setError({ password: "Password must be at least 7 characters" });
      return false;
    }
    return true;
  };

  const handleDeleteRequest = () => {
    if (!validatePassword()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setError({});

    try {
      await AuthApi.deleteAccount({ password });
      showToast(
        "error",
        "Account Deleted",
        "Your account has been successfully deleted. We're sorry to see you go."
      );
      logoutUser(router);
    } catch (err: any) {
      console.error("Delete account error:", err);

      if (err.response?.status === 401 || err.response?.status === 400) {
        setError({ password: "Incorrect password. Please try again." });
      } else if (err.response?.data?.message) {
        showToast("error", err.response.data.message);
      } else {
        showToast(
          "error",
          "Failed to delete account. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Delete Account" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        >
          <View className="mt-4 mx-5">
            {/* Header Section */}
            <View className="items-center mb-6">
              <Text className="font-orelega text-[22px] text-center text-[#2D2220] leading-[30px]">
                We hate to see you go
              </Text>
              <UrbanistText className="text-center text-[#646464] text-[15px] leading-[22px] mt-3 px-2">
                Before you delete your account, we want you to know that this
                action will delete your data across all Afro Basket platforms.
                If that's what you want, please enter your password to confirm
                it's you.
              </UrbanistText>
            </View>

            {/* Email Display */}
            <View className="bg-[#F5F5F5] rounded-lg px-4 py-4 items-center mb-6">
              <Text className="text-[15px] font-urbanist-semibold text-[#2D2220]">
                {user?.email}
              </Text>
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <CustomTextInput
                label="Password"
                isPassword
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error.password) {
                    setError({ ...error, password: undefined });
                  }
                }}
                error={error.password}
                editable={!isLoading}
              />
            </View>

            {/* Warning Box */}
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <View className="flex-row items-start mb-2">
                <Text className="text-[20px] mr-2">⚠️</Text>
                <Text className="text-red-600 font-urbanist-bold text-[15px] flex-1">
                  This action is permanent
                </Text>
              </View>
              <UrbanistText className="text-red-700 text-[14px] leading-[20px]">
                You are about to submit a request to permanently close your Afro
                Basket account and delete your data. Once your account has been
                closed, all products and services accessed through your account
                will no longer be available to you across ABX sites globally.
              </UrbanistText>
            </View>

            {/* Delete Button */}

            <Button
              title="Delete My Account"
              onPress={handleDeleteRequest}
              disabled={isLoading || !password}
              backgroundColor="#F04438"
              borderWidth={0}
            />

            <View className="mt-[16px] ">
              <Button
                title="Cancel"
                onPress={() => router.back()}
                disabled={isLoading}
              />
            </View>

            {/* Support Text */}
            <View className="items-center mt-6">
              <UrbanistText className="text-center text-[#8E8E8E] text-[13px] leading-[18px]">
                Having second thoughts? {"\n"}
                <Text
                  className="text-[#FF6B00] font-urbanist-semibold"
                  onPress={() => router.replace("/Support")}
                >
                  Contact our support team
                </Text>{" "}
                instead
              </UrbanistText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Confirmation Modal */}
      <LogoutModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Delete Account?"
        message="This action cannot be undone. All your data, orders, and saved items will be permanently deleted across all Afro Basket platforms. Are you absolutely sure?"
        confirmText="Yes, Delete"
        cancelText="No, Keep Account"
        onConfirm={handleConfirmDelete}
      />
    </ScreenWrapper>
  );
}

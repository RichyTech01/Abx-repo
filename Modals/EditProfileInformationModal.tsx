import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import Button from "@/common/Button";
import CustomTextInput from "@/common/CustomTextInput";
import OreAppText from "@/common/OreApptext";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/useUserStore";

type EditProfileInformationModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfileInformationModal({
  visible,
  onClose,
}: EditProfileInformationModalProps) {
  const { user, fetchUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Initialize form with user data when modal opens
  useEffect(() => {
    if (visible && user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
    }
  }, [visible, user]);

  // Check if form has changes
  const canSave = () => {
    if (!user) return false;
    
    return (
      firstName.trim() !== (user.first_name || "") ||
      lastName.trim() !== (user.last_name || "") ||
      phoneNumber.trim() !== (user.phone_number || "")
    );
  };

  // Handle form submission
  const handleSave = async () => {
    if (!canSave()) {
      showToast( "info", "No changes to save",);
      return;
    }

    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      showToast( "error", "First name and last name are required",);
      return;
    }

    if (!phoneNumber.trim()) {
      showToast( "error", "Phone number is required",);
      return;
    }

    setLoading(true);
    
    try {
      await AuthApi.setNewProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
      });

      // Refresh user data
      await fetchUser();
      
      showToast( "success", "Profile updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Profile update error:", error);
      showToast(
        error?.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    if (!loading) {
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      onClose();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable
            className="bg-white py-[18px] px-[20px] border border-[#F1EAE7] rounded-[16px]"
            onPress={(e) => e.stopPropagation()}
          >
            <OreAppText className="text-base mx-auto text-[#2D2220]">
              Edit Profile Information
            </OreAppText>

            <View className="gap-[16px] mt-[30px] relative">
              <CustomTextInput
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                editable={!loading}
              />

              <CustomTextInput
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                editable={!loading}
              />

              <CustomTextInput
                label="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View className="w-full mt-[40px]">
              <Button
                title="Save changes"
                onPress={handleSave}
                loading={loading}
                disabled={loading || !canSave()}
                paddingVertical={8}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
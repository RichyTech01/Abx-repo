import React from "react";
import {
  Text,
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import CustomTextInput from "@/common/CustomTextInput";

type EditProfileModalsProps = {
  visible: boolean;
  onClose: () => void;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
  } | null;
};

export default function EditProfileModals({
  visible,
  onClose,
  user,
}: EditProfileModalsProps) {
  const [fullName, setFullName] = useState(
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
  );
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");

  useEffect(() => {
    setFullName(`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim());
    setEmail(user?.email ?? "");
    setPhone(user?.phone_number ?? "");
  }, [user]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable
            className="bg-white py-[18px] px-[19.5px] rounded-[16px] border border-[#F1EAE7]"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <OreAppText className="text-[16px] mx-auto leading-[20px] text-[#2D2220]">
                Edit profile
              </OreAppText>

              <View className="gap-[16px] mt-[10%]">
                <CustomTextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={true}
                />
                <CustomTextInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  editable={true}
                />
                <CustomTextInput
                  label="Phone number"
                  value={phone}
                  onChangeText={setPhone}
                  editable={true}
                />
              </View>

              <View className="mt-[12%]">
                <Button
                  title="Save changes"
                  paddingVertical={10}
                  onPress={onClose}
                />
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

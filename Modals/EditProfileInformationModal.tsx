import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Button from "@/common/Button";
import CustomTextInput from "@/common/CustomTextInput";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";

type EditProfileInformationModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfileInformationModal({
  visible,
  onClose,
}: EditProfileInformationModalProps) {

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
            className="bg-white py-[18px] px-[20px] border border-[#F1EAE7] rounded-[16px]    "
            onPress={(e) => e.stopPropagation()}
          >
            <OreAppText className="text-base  mx-auto text-[#2D2220]  ">Change Address</OreAppText>

            <View className="gap-[16px] mt-[30px] relative ">
                 <CustomTextInput 
                  label="Full name"
                 />
                   <CustomTextInput 
                  label="Full name"
                 />
                   <CustomTextInput 
                  label="Full name"
                 />
            </View>

            <View className="w-full mt-[40px] ">
              <Button
                title={"Save changes"}
                onPress={onClose}
                // loading={loading}
                // disabled={loading || !canSave()}
                paddingVertical={8}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

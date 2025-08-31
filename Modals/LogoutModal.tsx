import React from "react";
import {
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";

type LogoutModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function LogoutModal({ visible, onClose }: LogoutModalProps) {
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
            className="bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7]"
            onPress={(e) => e.stopPropagation()}
          >
            <OreAppText className="text-[16px] mx-auto leading-[20px] text-[#2D2220]">
              Log out
            </OreAppText>

            <UrbanistText className="text-[#2D2220] text-[16px] leading-[22px] text-center mt-[8px] max-w-[288px] mx-auto   ">
              Are you sure you want to log out of your account?
            </UrbanistText>

            <View className="mt-[10px] gap-[10px]  ">
              <Button
                title="Yes, log out"
                paddingVertical={10}
                borderWidth={0}
                backgroundColor="#F04438"
                onPress={onClose}
              />
              <Button
                title="No, cancel"
                paddingVertical={10}
                borderWidth={0}
                onPress={onClose}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

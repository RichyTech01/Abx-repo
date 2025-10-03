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

type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
};

export default function LogoutModal({
  visible,
  onClose,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmButtonColor = "#F04438", 
  cancelButtonColor = "#0C513F",  
}: ConfirmModalProps) {
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
            className="bg-white py-[24px] px-[20px] rounded-[16px] border border-[#F1EAE7]"
            onPress={(e) => e.stopPropagation()}
          >
            <OreAppText className="text-[16px] mx-auto leading-[20px] text-[#2D2220]">
              {title}
            </OreAppText>

            <UrbanistText className="text-[#2D2220] text-[16px] leading-[22px] text-center mt-[8px] max-w-[288px] mx-auto">
              {message}
            </UrbanistText>

            <View className="mt-[10px] gap-[10px]">
              <Button
                title={confirmText}
                paddingVertical={10}
                borderWidth={0}
                backgroundColor={confirmButtonColor}
                textColor="#fff"
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              />
              <Button
                title={cancelText}
                paddingVertical={10}
                borderWidth={0}
                backgroundColor={cancelButtonColor}
                textColor="#fff"
                onPress={onClose}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

import React from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import OreAppText from "@/common/OreApptext";
import Button from "@/common/Button";
import SuccesLog from "@/assets/svgs/PasswordResetSuccessicon.svg";
import UrbanistText from "@/common/UrbanistText";

type PaymentSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  content?: string;
  tittle?: string;
  onPress: () => void;
};

export default function PaymentSuccessModal({
  visible,
  onClose,
  tittle = "Click to track your order",
  content = "You items will be delivered to you shortly. We are committed to being your shopping bestie.",
  onPress
}: PaymentSuccessModalProps) {

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        // onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%] "
        >
          <Pressable
            className="bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7] items-center"
            onPress={(e) => e.stopPropagation()}
          >
            <SuccesLog />
            <OreAppText className="text-[20px] mx-auto leading-[28px] text-[#2D2220] mt-2 ">
              Successful
            </OreAppText>
            <UrbanistText className="text-[16px] leading-[22px] text-[#2D2220] mt-[8px]  text-center w-[85%]">
              {content}
            </UrbanistText>
            <View className=" w-full mt-[10px] ">
              <Button
                title={tittle}
                onPress={() => {onClose();onPress()}}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

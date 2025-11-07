import SuccesLog from "@/assets/svgs/PasswordResetSuccessicon.svg";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";

type PaymentSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  content?: string;
  tittle?: string;
  onPress: () => void;
  secondButtonTitle?: string; // optional
  onSecondPress?: () => void; // optional
};

export default function PaymentSuccessModal({
  visible,
  onClose,
  tittle = "Click to track your order",
  content = "Your items will be delivered to you shortly. We are committed to being your shopping bestie.",
  onPress,
  secondButtonTitle,
  onSecondPress,
}: PaymentSuccessModalProps) {
  const hasSecondButton = !!secondButtonTitle && !!onSecondPress;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-center items-center bg-black/30">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable
            className="bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7] items-center"
            onPress={(e) => e.stopPropagation()}
          >
            <SuccesLog />
            <OreAppText className="text-[20px] mx-auto leading-[28px] text-[#2D2220] mt-2">
              Successful
            </OreAppText>
            <UrbanistText className="text-[16px] leading-[22px] text-[#2D2220] mt-[8px] text-center w-[85%]">
              {content}
            </UrbanistText>

            <View
              className={`w-full mt-[10px] ${
                hasSecondButton ? "flex-row justify-between" : ""
              }`}
            >
              {hasSecondButton && (
                <View className="w-[39%]">
                  <Button
                    title={secondButtonTitle!}
                    backgroundColor=""
                    textColor="#0C513F"
                    onPress={() => {
                      onClose();
                      onSecondPress!();
                    }}
                  />
                </View>
              )}

              <View className={hasSecondButton ? "w-[59%]" : "w-full"}>
                <Button
                  title={tittle}
                  onPress={() => {
                    onClose();
                    onPress();
                  }}
                />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

import React from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import OreAppText from "@/common/OreApptext";
import Button from "@/common/Button";
import SuccesLog from "@/assets/svgs/PasswordResetSuccessicon.svg";
import UrbanistText from "@/common/UrbanistText";

type PaymentSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PaymentSuccessModal({
  visible,
  onClose,
}: PaymentSuccessModalProps) {
    const router = useRouter()

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
              You items will be delivered to you shortly. We are committed to
              being your shopping bestie
            </UrbanistText>
            <View className=" w-full mt-[10px] ">
              <Button title="Click to track your order" onPress={() => router.replace("/(tabs)/Orders")} />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

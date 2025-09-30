import React from "react";
import { Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import { LoadingSpinner } from "@/common/LoadingSpinner";

type props = {
  visible: boolean;
  onClose: () => void;
};

export default function ChatLoadingModal({ visible, onClose }: props) {
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
            <LoadingSpinner />
            <OreAppText className="text-[20px] mx-auto leading-[28px] text-[#2D2220] mt-[24px] ">
              Loading
            </OreAppText>
            <UrbanistText className="text-[14px] leading-[20px] text-[#2D2220] mt-[16px] text-center w-[85%]">
              We are redireccting you to an avaliable customer service agent
            </UrbanistText>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

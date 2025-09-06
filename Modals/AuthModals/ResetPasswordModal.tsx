import React from "react";
import { Text, Modal, Pressable } from "react-native";
import SuccesLog from "@/assets/svgs/PasswordResetSuccessicon.svg";

type ResetPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ visible, onClose }) => {
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
        <Pressable
          className="w-[75%] bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7] items-center"
          onPress={() => {}} 
        >
          <SuccesLog />
          <Text className="text-[20px] leading-[28px] font-orelega text-[#2D2220] text-center mt-[8px]">
            Password reset successful
          </Text>
          <Text className="text-[16px] leading-[22px] font-urbanist text-[#2D2220] text-center mt-2">
            You have successfully reset your password. Be sure to keep it safe.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ResetPasswordModal;

import React from "react";
import {  Text, Modal, Pressable, View} from "react-native";
import Succesicon from "@/assets/svgs/VeriModalIcon.svg";
import Button from "@/common/Button";


type VerificationSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
};


export default function VerificationSuccessModal({ visible, onClose }: VerificationSuccessModalProps) {
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
          className="w-[80%] bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7] items-center"
          onPress={() => {}} 
        >
          <Succesicon />
          <Text className="text-[20px] leading-[28px] font-orelega text-[#2D2220] text-center mt-[8px]">
           Thank you for joining ABX
          </Text>
          <Text className="text-[16px] leading-[22px] font-urbanist text-[#2D2220] text-center mt-2">
            Enjoy stress free shopping for your food items from here on.
          </Text>

          <View className="w-full mt-[18px]  ">
             <Button title="Start shopping" onPress={() => {}}/>
          </View>
        </Pressable>

      </Pressable>
    </Modal>
  )
}
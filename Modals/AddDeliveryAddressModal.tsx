import React from "react";
import { Text, Modal, Pressable, View } from "react-native";
import Succesicon from "@/assets/svgs/ChnageAdrressIcon.svg";
import Button from "@/common/Button";
import UrbanistText from "@/common/UrbanistText";
import { useRouter } from "expo-router";


type AddDeliveryAddressModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddDeliveryAddressModal({
  visible,
  onClose,
}: AddDeliveryAddressModalProps) {
  const router = useRouter();

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
          className="w-[90%] bg-white py-[16px] px-[16px] rounded-[16px] border border-[#F1EAE7] items-center"
          onPress={onClose}
        >
          <Succesicon />

          <Text className="text-[16px] leading-[22px] font-urbanist-medium text-[#2D2220] text-center mt-2">
            Are you sure you want to change your current location?{" "}
          </Text>

          <View className="w-full mt-[18px] flex-row items-center justify-between ">
            <View className="w-[47.5%]">
              <Button
                title="Cancel"
                backgroundColor="#E4E4E4"
                fontClassName="urbanist-bold"
                textColor="#A6A6A6"
                borderWidth={0}
                onPress={onClose}
              />
            </View>
            <View className="w-[47.5%]">
              <Button
                title="Yes, i'm sure"
                fontClassName="urbanist-bold"
                onPress={() =>{ router.push("/Screens/Carts/NewDeliveryAddressScreen"); onClose()}}
                borderWidth={0}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

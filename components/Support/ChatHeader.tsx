import { useState } from "react";

import { View, Text, Pressable } from "react-native";
import React from "react";
import ChatDetailIcon from "@/assets/svgs/ChatDetailsIcon.svg";
import SupportImg from "@/assets/svgs/SupportImg.svg";
import SupportPolicyModal from "@/Modals/SupportPolicyModal";

export default function ChatHeader() {
  const [showModal, setShowModal] = useState(false);
  return (
    <View className="bg-white border-b border-[#F1EAE7] mt-[5%] py-[15px] px-[16px]  flex-row items-center justify-between ">
      <View className="flex-row items-center gap-[16px] ">
        <View className="bg-blue-300 h-[30px] w-[30px] rounded-full ">
          <SupportImg />
        </View>
        <View className="flex-col gap-[4px] ">
          <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#2D2220] ">
            Henry Osas
          </Text>
          <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#2D2220] ">
            Support center rep - ABX097456
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setShowModal((prev) => !prev)}
        className="items-end justify-center h-10 w-10 "
      >
        <ChatDetailIcon />
      </Pressable>

      <SupportPolicyModal
        onClose={() => setShowModal((prev) => !prev)}
        visible={showModal}
      />
    </View>
  );
}

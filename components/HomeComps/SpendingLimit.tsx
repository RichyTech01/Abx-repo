import { View, Text } from "react-native";
import React from "react";
import Button from "@/common/Button";
import SpendingLimgitImg from "@/assets/svgs/SpendingLimitIcon.svg";

export default function SpendingLimit() {
  return (
    <View className="bg-[#FFDACA] flex-row items-center rounded-[18px] px-[20px] py-[16px] border border-[#F1EAE7] shadow shadow-[#0000000A]/5 mx-[20px] gap-[19.98px]  ">
      <View className="w-[65%]">
        <Text className="text-[#2D2220]  text-[16px] leading-[20px] font-orelega    ">
          Set a spending limit
        </Text>
        <Text className="text-[#2D2220] text-[12px] leading-[16px] font-urbanist mt-[2px]     ">
          Setting a budget helps you track your spending easier{" "}
        </Text>
        <View className="mt-[22px] ">
          <Button
            backgroundColor="#DC6C3C"
            title="Set up now"
            borderWidth={0}
            onPress={() => {}}
          />
        </View>
      </View>

      <View className="w-[35%] ">
         <SpendingLimgitImg />
      </View>
    </View>
  );
}

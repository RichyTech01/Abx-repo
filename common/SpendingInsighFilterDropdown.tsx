import { View, Text } from "react-native";
import React from "react";
import DropDown from "@/assets/svgs/DateDropDownIcon.svg";

export default function SpendingInsighFilterDropdown() {
  return (
    <View className="border border-[#B6C1CA] bg-white rounded-[16px] p-[16px]   ">
      <View className="flex-row items-center gap-[8px] w-[70%]">
        <View className="border border-[#DCE0E5] rounded-[14px] py-[5px] px-[8px] flex-row items-center justify-between max-w-[159px] w-full  ">
          <Text className="text-[15px] font-urbanist-medium text-[#14181F]  ">
            November
          </Text>
          <DropDown />
        </View>
        <View className="border border-[#DCE0E5] rounded-[14px] py-[5px] px-[8px] flex-row items-center justify-between max-w-[59px] w-full">
          <Text className="text-[15px] font-urbanist-medium text-[#14181F]  ">
            2024
          </Text>
          <DropDown />
        </View>
      </View>
    </View>
  );
}

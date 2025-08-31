import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import OreAppText from "@/common/OreApptext";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import SpendingInsightIcon from "@/assets/svgs/SpendingInsightIcon.svg";

export default function Finance() {
  const router = useRouter();

  return (
    <View>
      <OreAppText className="text-[#2D2220] text-[16px] leading-[20px]  my-[16px] ">
        Finance
      </OreAppText>

      <View className="border border-[#F1EAE7] rounded-[8px] py-[10px] px-[8px] bg-white ">
        <TouchableOpacity
          className="py-[4px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between "
          onPress={() =>
            router.push("/Screens/AccountScreen/SpendingBudgetScreen")
          }
        >
          <View className="flex-row items-center ">
            <SpendingInsightIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Spending Insight
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>
      </View>
    </View>
  );
}

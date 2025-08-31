import { View, Text } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";

export default function SpendingBudgetScreen() {
  return (
    <ScreenWrapper>
      <Header title="Spending budget" />

      <View>
        <View className="bg-[#346E5F] rounded-[16px] py-[26px] px-[20px] w-[80%] mx-auto">
          <Text className="text-[#EFEFEF] text-[14px] leading-[20px] font-urbanist-medium ">
            Spending budget
          </Text>
          <View className="mt-[4px] flex-row items-center justify-between ">
             <OreAppText className="text-[36px] leading-[48px] text-white  ">€0</OreAppText>
             <View className="bg-[#FBE6C5] rounded-[8px] p-[8px] flex-row items-center ">
                <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px] ">Amount left: </Text>
                <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px] ">€0</Text>
             </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

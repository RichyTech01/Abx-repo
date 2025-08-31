import { View, Text } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";
import SPendingLimitIcon from "@/assets/svgs/AddspendLimitIcon.svg";
import SPendingLimitBg from "@/assets/svgs/PartOfLimitBg.svg";
import SecondSPendingLimitBg from "@/assets/svgs/SecondLimitBg.svg";
import Button from "@/common/Button";
import TabSwitcher from "@/common/TabSwitcher";

export default function SpendingBudgetScreen() {
  return (
    <ScreenWrapper>
      <Header title="Spending budget" />

      <View className="mt-[10%]">
        <View className="bg-[#346E5F] rounded-[16px] py-[26px] px-[20px] w-[80%] mx-auto relative">
          <View className="absolute top-0 right-0 z-0">
            <SPendingLimitBg />
          </View>

          <View className="absolute bottom-0 left-0 z-0">
            <SecondSPendingLimitBg />
          </View>

          <Text className="text-[#EFEFEF] text-[14px] leading-[20px] font-urbanist-medium">
            Spending budget
          </Text>

          <View className="mt-[4px] flex-row items-center justify-between py-[8px]">
            <OreAppText className="text-[36px] leading-[48px] text-white">
              €0
            </OreAppText>
            <View className="bg-[#FBE6C5] rounded-[8px] p-[8px] flex-row items-center">
              <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                Amount left:{" "}
              </Text>
              <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                €0
              </Text>
            </View>
          </View>

          <View className="mt-[16px]">
            <Button
              title="Set spending limit"
              backgroundColor="white"
              textColor="#0C513F"
              icon={<SPendingLimitIcon />}
              iconPosition="left"
              paddingVertical={10}
              borderWidth={0}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

import { View, Text, Pressable } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import GoBackIcon from "../../../assets/svgs/BackArrow.svg";
import DropDownIcon from "../../../assets/svgs/SmallDropDownoIcon.svg";
import OreAppText from "@/common/OreApptext";
import { useNavigation } from "@react-navigation/native";
import AdjustIcon from "../../../assets/svgs/AdjustIcon.svg";
import BudgetTracker from "@/components/AccountComps/BudgetTracker";
import SpendingBreakDown from "@/components/AccountComps/SpendingBreakDown";

export default function SpendingInsightScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <View className="flex-row items-center justify-between mx-[18px] ">
        <Pressable
          onPress={() => navigation.goBack()}
          className=" h-8 w-8 items-start justify-center  "
        >
          <GoBackIcon />
        </Pressable>

        <OreAppText className="text-[20px] leading-[28px] text-[#2D2220]  left-1/ -translate-x-1/">
          Spending Insight
        </OreAppText>

        <View className="rounded-[30px] bg-white py-[4px] px-[12px] flex-row items-center gap-[4px]">
          <Text style={{ fontFamily: "ManropeSemiBold" }}>Jan</Text>
          <DropDownIcon />
        </View>
      </View>

      <View className="mt-[24px] mx-[17px]  ">
        <View className="flex-row items-center justify-between ">
          <Text className="text-[16px] text-[#181818] font-urbanist-bold  ">
            Spending overview
          </Text>
          <View className="flex-row items-center gap-[4px]  ">
            <Text className="text-[14px] text-[#0C513F] font-urbanist-bold  ">
              Adjust
            </Text>
            <AdjustIcon />
          </View>
        </View>

        <View
          className="bg-white rounded-[16px] p-[20px] mt-[16px]  shadow-sm "
          style={{ shadowColor: "#0000000D", elevation: 2 }}
        >
          <View className="">
            <View className=" ">
              <Text className="font-urbanist-medium text-[14px] leading-[21px] text-[#929292]   ">
                Current spending budget
              </Text>
              <Text className="text-[20px] leading-[21px] font-urbanist-bold text-[#181818] mt-[4px]  ">
                €6,000
              </Text>
            </View>
          </View>
          <View>
            <BudgetTracker />
          </View>
        </View>
        <View>
          <SpendingBreakDown />
        </View>
      </View>
    </ScreenWrapper>
  );
}

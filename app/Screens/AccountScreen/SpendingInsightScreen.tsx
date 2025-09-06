import { View, Text, Pressable } from "react-native";
import Header from "@/common/Header";
import ScreenWrapper from "@/common/ScreenWrapper";
import GoBackIcon from "../../../assets/svgs/BackArrow.svg";
import DropDownIcon from "../../../assets/svgs/SmallDropDownoIcon.svg";
import OreAppText from "@/common/OreApptext";
import { useNavigation } from "@react-navigation/native";

export default function SpendingInsightScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <View className="flex-row items-center justify-between mx-[18px]">
        <Pressable
          onPress={() => navigation.goBack()}
          className=" h-8 w-8 items-start justify-center  "
        >
          <GoBackIcon />
        </Pressable>

        <OreAppText className="text-[20px] leading-[28px] text-[#2D2220] absolute left-1/2 -translate-x-1/2">
          Spending Insight
        </OreAppText>

        <View className="rounded-[30px] bg-white py-[4px] px-[12px] flex-row items-center gap-[4px]">
          <Text style={{ fontFamily: "ManropeSemiBold" }}>Jan</Text>
          <DropDownIcon />
        </View>
      </View>
    </ScreenWrapper>
  );
}

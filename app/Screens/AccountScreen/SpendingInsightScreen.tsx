import { View, Text, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import GoBackIcon from "../../../assets/svgs/BackArrow.svg";
import { useRouter } from "expo-router";
import DropDownIcon from "../../../assets/svgs/SmallDropDownoIcon.svg";
import OreAppText from "@/common/OreApptext";
import AdjustIcon from "../../../assets/svgs/AdjustIcon.svg";
import BudgetTracker from "@/components/AccountComps/BudgetTracker";
import SpendingBreakDown from "@/components/AccountComps/SpendingBreakDown";
import { SpendingInsightResponse } from "@/types/SpendingBudgetApi";
import SpendingBudgetApi from "@/api/SpendingBudgetApi";
import { useBudgetStore } from "@/store/useBudgetStore";
import SpendingInsighFilterDropdown from "@/common/SpendingInsighFilterDropdown";

export default function SpendingInsightScreen() {
  const { budgetAmount } = useBudgetStore();

  const router = useRouter();
  const [insight, setInsight] = useState<SpendingInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const data = await SpendingBudgetApi.getSpendingInsights();
        setInsight(data);
        // console.log("Fetched Insight:", data);
      } catch (error) {
        console.error("Failed to load spending budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [budgetAmount]);

  return (
    <ScreenWrapper>
      <View className="flex-row items-center justify-between mx-[18px] ">
        <Pressable
          onPress={() => router.dismiss(1)}
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

      {showDropdown && (
        <View className="">
          <SpendingInsighFilterDropdown />
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-[24px] mx-[17px]  ">
          <View className="flex-row items-center justify-between ">
            <Text className="text-[16px] text-[#181818] font-urbanist-bold  ">
              Spending overview
            </Text>
            <Pressable
              className="flex-row items-center gap-[4px]  "
              onPress={() => router.push("/Screens/AccountScreen/AdjustLimit")}
            >
              <Text className="text-[14px] text-[#0C513F] font-urbanist-bold  ">
                Adjust
              </Text>
              <AdjustIcon />
            </Pressable>
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
                  €
                  {Number(insight?.amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </Text>
              </View>
            </View>
            <View>
              <BudgetTracker
                spent={insight?.total_spent}
                budget={insight?.amount}
                 transactions={insight?.transactions ?? []}
              />
            </View>
          </View>
          <View>
            <SpendingBreakDown transactions={insight?.transactions ?? []} />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

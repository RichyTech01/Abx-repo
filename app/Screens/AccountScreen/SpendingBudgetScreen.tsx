import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";
import SPendingLimitIcon from "@/assets/svgs/AddspendLimitIcon.svg";
import SPendingLimitBg from "@/assets/svgs/PartOfLimitBg.svg";
import SecondSPendingLimitBg from "@/assets/svgs/SecondLimitBg.svg";
import Button from "@/common/Button";
import SpendingBudgetTab from "@/common/SpendingBudgetTab";
import SpendingBudgetTransactions from "@/components/AccountComps/SpendingBudgetTransactions";
import { useRouter } from "expo-router";
import SpendingBudgetApi, {
  SpendingBudgetResponse,
} from "@/api/SpendingBudgetApi";
import getSpendingInsight from "@/api/SpendingBudgetApi";

export default function SpendingBudgetScreen() {
  const [activeTab, setActiveTab] = useState("Spending budget");
  const [budget, setBudget] = useState<SpendingBudgetResponse | null>(null);
  const [insight, setInsight] = useState<SpendingBudgetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const data = await SpendingBudgetApi.getCurrentSpendingBudget();
        setBudget(data);
        console.log("Fetched budget:", data);
      } catch (error) {
        console.error("Failed to load spending budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);


    useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const data = await getSpendingInsight.getCurrentSpendingBudget();
        setBudget(data);
        console.log("Fetched budget:", data);
      } catch (error) {
        console.error("Failed to load spending budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);
  


  return (
    <ScreenWrapper>
      <Header title="Spending budget" />

      <View className="w-[80%] mx-auto px-[20px] mt-[8%]">
        <SpendingBudgetTab
          tabs={["Spending budget", "Spending insight"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          navigateTab="Spending insight"
        />
      </View>

      <View className="mt-[8%]">
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

          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <View className="mt-[4px] flex-row items-center justify-between py-[8px]">
              <OreAppText className="text-[36px] leading-[48px] text-white">
                €{budget?.amount ?? 0}
              </OreAppText>
              <View className="bg-[#FBE6C5] rounded-[8px] p-[8px] flex-row items-center">
                <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                  Amount left:{" "}
                </Text>
                <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                  €{budget?.amount ?? 0}
                </Text>
              </View>
            </View>
          )}

          <View className="mt-[16px]">
            <Button
              title="Set spending limit"
              backgroundColor="white"
              textColor="#0C513F"
              icon={<SPendingLimitIcon />}
              iconPosition="left"
              paddingVertical={10}
              borderWidth={0}
              onPress={() => router.push("/Screens/AccountScreen/AdjustLimit")}
            />
          </View>
        </View>

        <SpendingBudgetTransactions />
      </View>
    </ScreenWrapper>
  );
}

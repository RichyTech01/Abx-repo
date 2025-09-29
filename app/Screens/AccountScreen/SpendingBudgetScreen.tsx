import SpendingBudgetApi from "@/api/SpendingBudgetApi";
import SPendingLimitIcon from "@/assets/svgs/AddspendLimitIcon.svg";
import SPendingLimitBg from "@/assets/svgs/PartOfLimitBg.svg";
import SecondSPendingLimitBg from "@/assets/svgs/SecondLimitBg.svg";
import Button from "@/common/Button";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";
import ScreenWrapper from "@/common/ScreenWrapper";
import SpendingBudgetTab from "@/common/SpendingBudgetTab";
import SpendingBudgetTransactions from "@/components/AccountComps/SpendingBudgetTransactions";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useBudgetStore } from "@/store/useBudgetStore";

export default function SpendingBudgetScreen() {
  const [activeTab, setActiveTab] = useState("Spending budget");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { budget, setBudget } = useBudgetStore();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const data = await SpendingBudgetApi.getCurrentSpendingBudget();
        // const normalized = {
        //   ...data,
        //   amount: Number(data.amount ?? 0),
        //   amount_spent: Number(data.amount_spent ?? 0),
        //   balance: Number(data.balance ?? 0),
        // };
        setBudget(String(data.amount ?? 0), data.id ?? "", data);
      } catch (error) {
        console.error("Failed to load spending budget:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!budget) {
      fetchBudget();
    }
  }, []);

  const amountLeft =
    Number(budget?.amount ?? 0) - Number(budget?.amount_spent ?? 0);

  return (
    <ScreenWrapper>
      <Header title="Spending budget" />

      {Number(budget?.amount ?? 0) > 0 ? (
        <View className="w-[80%] mx-auto px-[20px] mt-[8%]">
          <SpendingBudgetTab
            tabs={["Spending budget", "Spending insight"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            navigateTab="Spending insight"
          />
        </View>
      ): null} 

      {/* 👇 Scrollable content after the tab */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
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
                  €
                  {Number(budget?.amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </OreAppText>
                <View className="bg-[#FBE6C5] rounded-[8px] p-[8px] flex-row items-center">
                  <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                    Amount left:{" "}
                  </Text>
                  <Text className="font-urbanist-semibold text-[#181818] text-[12px] leading-[16px]">
                    €{Number(amountLeft ?? 0).toFixed(0)}
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
                disabled={Number(budget?.amount ?? 0) > 0}
                onPress={() =>
                  router.push("/Screens/AccountScreen/AdjustLimit")
                }
              />
            </View>
          </View>

          <SpendingBudgetTransactions
            transactions={budget?.transactions ?? []}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomNumericKeyboard from "@/common/CustomNumericKeyboard";
import OreAppText from "@/common/OreApptext";
import LimitDropDown from "../../../assets/svgs/LimitDropDOwn.svg";
import Button from "@/common/Button";
import SetBillingCycleModal from "@/Modals/SetBillingCycleModal";
import PaymentSuccessModal from "@/Modals/PaymentSuccessModal";
import { useRouter } from "expo-router";
import SpendingBudgetApi from "@/api/SpendingBudgetApi";
import { useBudgetStore } from "@/store/useBudgetStore";
import showToast from "@/utils/showToast";

type BillingOption = "immediate" | "next_month";

export default function AdjustLimit() {
  const { budgetAmount, budgetId, setBudget } = useBudgetStore();

  const router = useRouter();
  const [amount, setAmount] = useState("0");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBillingOption, setSelectedBillingOption] =
    useState<BillingOption>("immediate");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getBillingOptionText = () => {
    if (selectedBillingOption === "immediate") {
      return "Apply immediately";
    } else {
      if (selectedDate) {
        const options: Intl.DateTimeFormatOptions = {
          month: "short",
          day: "numeric",
        };
        return `Apply on ${selectedDate.toLocaleDateString("en-US", options)}`;
      }
      return "Apply next month";
    }
  };

  const handleSetBudget = async () => {
    setIsProcessing(true);
    try {
      // Remove commas and convert to number
      const numericAmount = amount.replace(/,/g, "");

      let budgetData;
      if (selectedBillingOption === "immediate") {
        budgetData = {
          amount: numericAmount,
          start_date: new Date().toISOString().split("T")[0],
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        };
      } else {
        // Use selected date or next month's first day as fallback
        const startDate =
          selectedDate ||
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        budgetData = {
          amount: numericAmount,
          start_date: startDate.toISOString().split("T")[0],
          month: startDate.getMonth() + 1,
          year: startDate.getFullYear(),
        };
      }

      let response;
      if (budgetAmount && budgetId) {
        response = await SpendingBudgetApi.updateSpendingBudget(
          budgetId,
          budgetData
        );
      } else {
        response = await SpendingBudgetApi.setSpendingBudget(budgetData);
      }
      setBudget(String(response.amount ?? 0), response.id ?? "", response);

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Failed to set/update budget:", error);
      showToast("error", error)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBillingCycleConfirm = (option: BillingOption, date?: Date) => {
    setSelectedBillingOption(option);
    if (option === "next_month" && date) {
      setSelectedDate(date);
    }
    setShowModal(false);
  };

  return (
    <ScreenWrapper>
      <Header title="Adjust limit" />
      <View className="mt-[60px] mx-[20px]">
        <View className="pb-[18px] mx-auto border-b border-[#EAECF0] w-full items-center">
          <OreAppText className="text-[#181818] leading-[40px] text-[32px]">
            €{amount}
          </OreAppText>
        </View>

        <View className="flex-row items-center mx-auto pt-[18px]">
          <Text className="text-[16px] font-urbanist-semibold leading-[21px] text-[#929292]">
            Current limit:{" "}
          </Text>
          <Text className="text-[16px] font-urbanist-bold leading-[22px] text-[#181818]">
            €{budgetAmount}
          </Text>
        </View>

        <Pressable
          className="mt-[8%] bg-white px-[16px] py-[8px] rounded-[38px] flex-row items-center gap-[11.33px] mx-auto mb-[8.2%]"
          onPress={() => setShowModal(true)}
        >
          <Text className="text-[14px] font-urbanist-semibold leading-[20px] text-[#181818]">
            {getBillingOptionText()}
          </Text>
          <LimitDropDown />
        </Pressable>

        <View>
          <CustomNumericKeyboard value={amount} onChange={setAmount} />
        </View>
      </View>

      <View className="mx-[20px]">
        <Button
          title={isProcessing ? "Processing..." : "Confirm limit"}
          onPress={handleSetBudget}
          disabled={isProcessing}
        />
      </View>

      <SetBillingCycleModal
        value={showModal}
        setValue={setShowModal}
        // setShowSuccessModal={setShowSuccessModal}
        onConfirm={handleBillingCycleConfirm}
        initialOption={selectedBillingOption}
        initialDate={selectedDate}
      />

      <PaymentSuccessModal
        content="Your spending limit has been successfully adjusted."
        tittle="Start shopping"
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onPress={() => {
          router.dismiss(2);
          setShowSuccessModal(false);
        }}
      />
    </ScreenWrapper>
  );
}

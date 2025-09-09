import { View, Text } from "react-native";
import React from "react";
import UrbanistText from "./UrbanistText";

type TransactioncardProps = {
  TotalAmount?: number;
  DatePlaced?: string;
  OrderNumber?: string;
};
export default function Transactioncard({
  TotalAmount,
  DatePlaced,
  OrderNumber,
}: TransactioncardProps) {
  return (
    <View className="bg-white border border-[#E5E7EB] rounded-[8px] px-[14.5px] py-[11px] flex-row items-center justify-between gap-2 shadow-sm "  style={{ shadowColor: "#0000000D", elevation: 2 }}>
      <View className="gap-[4px] ">
        <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]   ">
          Order number
        </Text>
        <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280]  ">
          {OrderNumber}
        </UrbanistText>
      </View>
      <View className="gap-[4px] ">
        <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]   ">
          Date placed
        </Text>
        <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280]  ">
          {DatePlaced}
        </UrbanistText>
      </View>
      <View className="gap-[4px] items-end">
        <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]   ">
          Total amount
        </Text>
        <Text className="text-[12px] leading-[16px] font-urbanist-bold text-[#111827] ">
          £{TotalAmount}
        </Text>
      </View>
    </View>
  );
}

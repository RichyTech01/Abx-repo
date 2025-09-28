import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import UrbanistText from "./UrbanistText";

import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";

interface OrderCardProps {
  orderNumber: string;
  datePlaced: string;
  totalAmount: string;
  status: string;
  statusColor?: string;
  isDelivered?: boolean;
  onPressDetail?: () => void;
}

export default function OrderCard({
  orderNumber,
  datePlaced,
  totalAmount,
  status,
  statusColor = "#F4B551",
  isDelivered = false,
  onPressDetail,
}: OrderCardProps) {
  return (
    <View className="bg-white border border-[#E5E7EB] rounded-[8px]">
      {/* Top Info */}
      <View className="border-b border-[#E5E7EB] px-[14.5px] py-[10px] flex-row items-center justify-between">
        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
            Order number
          </Text>
          <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
            {orderNumber}
          </UrbanistText>
        </View>

        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
            Date placed
          </Text>
          <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
            {datePlaced}
          </UrbanistText>
        </View>

        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
            Total amount
          </Text>
          <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
            {totalAmount}
          </UrbanistText>
        </View>
      </View>

      {/* Status Row */}
      <View className="p-[8px] flex-row items-center justify-between">
        <View className="gap-[4px] flex-row items-center">
          {isDelivered || status.toLowerCase().includes('delivered') ? <DeliveredIcon /> : <ProcessingIcon />}
          <UrbanistText
            className="text-[12px] leading-[16px]"
            style={{ color: statusColor }}
          >
            {status}
          </UrbanistText>
        </View>

        <TouchableOpacity onPress={onPressDetail}>
          <UrbanistText className="text-[12px] leading-[16px] text-[#656565]">
            See detail
          </UrbanistText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
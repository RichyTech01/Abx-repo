import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import UrbanistText from "./UrbanistText";

import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import ShippedForDeliveryIcon from "@/assets/svgs/ShippedForDeliveryIcon.svg";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";

interface OrderCardProps {
  orderNumber: string;
  datePlaced: string;
  totalAmount: string;
  status: "processing" | "shipped" | "delivered";
  onPressDetail?: () => void;
}

export default function OrderCard({
  orderNumber,
  datePlaced,
  totalAmount,
  status,
  onPressDetail,
}: OrderCardProps) {
  const getStatus = () => {
    switch (status) {
      case "processing":
        return {
          text: "Your order is being processed",
          color: "#F4B551",
          Icon: ProcessingIcon,
        };
      case "shipped":
        return {
          text: "Your item has been shipped for delivery",
          color: "#DC6C3C",
          Icon: ShippedForDeliveryIcon,
        };
      case "delivered":
        return {
          text: "Your order has been delivered",
          color: "#05A85A",
          Icon: DeliveredIcon,
        };
      default:
        return {
          text: "Unknown status",
          color: "#6B7280",
          Icon: ProcessingIcon,
        };
    }
  };

  const { text, color, Icon } = getStatus();

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
          <Icon />
          <UrbanistText
            className="text-[12px] leading-[16px]"
            style={{ color }}
          >
            {text}
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

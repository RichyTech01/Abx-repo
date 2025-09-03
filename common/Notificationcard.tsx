import { View, Text } from "react-native";
import React from "react";
import OreAppText from "./OreApptext";
import UrbanistText from "./UrbanistText";

type NotificationCardProps = {
  title: string;
  message: string;
  date: string;
  isRead: boolean;
};

export default function Notificationcard({
  title,
  message,
  date,
  isRead,
}: NotificationCardProps) {
  return (
    <View
      className={`border border-[#E4E7EC] py-[12px] px-[16px] bg-white rounded-[4px] ${
        isRead ? "opacity-50" : "opacity-100"
      }`}
    >
      <View className="gap-[4px]">
        <OreAppText className="leading-[18px] text-[#2D2220] text-[14px]">
          {title}
        </OreAppText>
        <UrbanistText className="text-[14px] leading-[20px] text-[#2C2C2C]">
          {message}
        </UrbanistText>
        <Text className="font-urbanist-medium text-[10px] leading-[14px] text-[#929292]">
          {date}
        </Text>
      </View>
    </View>
  );
}

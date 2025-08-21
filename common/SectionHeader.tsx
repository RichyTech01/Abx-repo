import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg"

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
  RightIcon?: React.ReactNode; 
}

export default function SectionHeader({ title, onPress, RightIcon }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mx-[20px]">
      <Text className="text-[16px] font-orelega text-[#2D2220] leading-[20px]">
        {title}
      </Text>
      <TouchableOpacity
        className="bg-[#FFFFFF] rounded-[8px] w-[32px] h-[32px] items-center justify-center"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <ArrowRIght/>
      </TouchableOpacity>
    </View>
  );
}

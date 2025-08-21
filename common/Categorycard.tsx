import React from "react";
import { View, Text } from "react-native";

interface CategoryCardProps {
  bgColor: string;        
  borderColor: string;    
  Icon: React.ReactNode;  
  title: string;         
  subtitle: string;    
}

export default function CategoryCard({
  bgColor,
  borderColor,
  Icon,
  title,
  subtitle,
}: CategoryCardProps) {
  return (
    <View
      className="rounded-[16px] px-[10px] py-[20px] items-center justify-between w-[176px]"
      style={{ backgroundColor: bgColor }}
    >
      <View
        className="border-dashed rounded-full bg-transparent p-[5px]"
        style={{ borderColor, borderWidth: 1 }}
      >
        {Icon}
      </View>

      <View className="mt-[8px items-center">
        <Text className="text-[#2C2C2C] text-[14px] font-urbanist-semibold leading-[20px]">
          {title}
        </Text>
        <Text className="text-[#424242] text-[12px] font-urbanist-semibold leading-[16px] text-center">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

import {Text, TouchableOpacity } from "react-native";
import React from "react";

type IconButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

export default function IconButton({ label, onPress, icon }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border border-[#F1EAE7] rounded-[8px] items-center flex-row justify-center py-[8px] gap-[4px]"
    >
      {icon}
      <Text className="font-urbanist-medium text-[12px] leading-[16px] text-[#424242]">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

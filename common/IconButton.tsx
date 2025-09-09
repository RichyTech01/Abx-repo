import {Text, TouchableOpacity } from "react-native";
import React from "react";

type IconButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled: boolean;
};

export default function IconButton({ label, onPress, icon, disabled }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`border ${disabled? "opacity-50":""} border-[#F1EAE7] rounded-[8px] items-center flex-row justify-center py-[8px] gap-[4px]`}
      disabled={disabled}
    >
      {icon}
      <Text className="font-urbanist-medium text-[12px] leading-[16px] text-[#424242]">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

import { View, TouchableOpacity } from "react-native";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: string;
  onPress: () => void;
  backgroundColor?: string;
  extraContent?: React.ReactNode; 
}

export default function SupportCard({
  icon,
  title,
  description,
  buttonText,
  buttonColor = "#000",
  onPress,
  backgroundColor = "#ECF1F0",
  extraContent,
}: SupportCardProps) {
  return (
    <TouchableOpacity
      className="rounded-[8px] py-[13px] w-full items-center px-[28px]"
      style={{ backgroundColor }}
      activeOpacity={0.9}
    >
      <View className="w-[75%] items-center">
        {icon}
        <OreAppText className="text-[16px] leading-[20px] text-[#2C2C2C] mt-[16px]">
          {title}
        </OreAppText>
        <UrbanistText className="text-[#424242] text-[14px] leading-[20px] text-center mt-[8px]">
          {description}
        </UrbanistText>

        {extraContent ? <View className="mt-[8px]">{extraContent}</View> : null}
      </View>

      <View className="w-full mt-[8px]">
        <Button
          title={buttonText}
          paddingVertical={15}
          backgroundColor={buttonColor}
          borderColor={buttonColor}
          onPress={onPress}
        />
      </View>
    </TouchableOpacity>
  );
}

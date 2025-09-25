import { View, Text } from "react-native";
import CompletedTImelineIcon from "@/assets/svgs/CompletedTImelineIcon.svg";

const steps = [
  "Order placed",
  "Item is being processed",
  "Item in transit",
  "Delivered",
];

export default function CompletedHistoryTimeline() {
  return (
    <View className="bg-white px-[26px] py-[12px] rounded-[4px] border border-[#F1EAE7] mt-[20px] ">
      <Text className="text-[14px] text-[#0C513F] font-urbanist-semibold leading-[20px] ">
        Status history
      </Text>

      <View className="mt-[13px]">
        {steps.map((step, index) => (
          <View key={index} className="flex-row mb-[px]">
            {/* Left timeline */}
            <View className="items-center gap-[2px] mt-[2px]">
              <CompletedTImelineIcon />
              {index !== steps.length - 1 && (
                <View className="bg-[#0C513F] w-[2px] h-[18px]" />
              )}
            </View>

            {/* Label */}
            <Text className="ml-[8px] text-[12px] leading-[16px] text-[#0C513F] font-urbanist  ">
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

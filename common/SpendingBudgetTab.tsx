import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

interface SpendingBudgetTabProps {
  tabs: string[]; // Tab labels
  activeTab: string;
  onTabChange: (tab: string) => void;
  navigateTab?: string; 
}

export default function SpendingBudgetTab({
  tabs,
  activeTab,
  onTabChange,
  navigateTab,
}: SpendingBudgetTabProps) {
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    if (tab === navigateTab ) {
      router.push("/Screens/AccountScreen/SpendingInsightScreen");
    } else {
      onTabChange(tab);
    }
  };

  return (
    <View className="bg-[#EFEFEF] rounded-[8px] py-[4px] flex-row px-[4%]">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => handleTabPress(tab)}
          className={`flex-1 items-center px-2 py-[10px] rounded-[8px] justify-center ${
            activeTab === tab ? "bg-white" : "bg-transparent"
          }`}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className={`text-center text-[14px] leading-[20px] ${
              activeTab === tab
                ? "text-[#0C513F] font-urbanist-semibold"
                : "text-[#1A1A1A] font-urbanist"
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

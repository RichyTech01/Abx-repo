import React from "react";
import { View, TouchableOpacity } from "react-native";
import OreAppText from "./OreApptext";

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
}

export default function TabSwitcher({ activeTab, onTabChange, tabs }: TabSwitcherProps) {
  return (
    <View className="bg-[#EFEFEF] rounded-[8px] px-[24px] py-[4px] flex-row items-center justify-between">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        const isAboutStore = tab === "About store";

        const paddingClass = isActive
          ? isAboutStore
            ? "px-[32px]"
            : "px-[16px]"
          : "px-[16px]";

        return (
          <TouchableOpacity
            key={index}
            className={`rounded-[8px] py-[10px] ${isActive ? "bg-white" : ""} ${paddingClass}`}
            onPress={() => onTabChange(tab)}
          >
            <OreAppText className="text-[#346E5F] text-[16px] leading-[20px]">
              {tab}
            </OreAppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

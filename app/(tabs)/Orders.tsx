import React, { useState } from "react";
import { View, Text } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import OreAppText from "@/common/OreApptext";
import TabSwitcher from "@/common/TabSwitcher";
import AllOrders from "@/components/OrderComps/AllOrders";
import OngoingOrders from "@/components/OrderComps/OngoingOrders";
import CompletedOrders from "@/components/OrderComps/CompletedOrders";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<string>("All Orders");

  const tabs = ["All Orders", "Ongoing orders", "Completed orders"];

  return (
    <ScreenWrapper>
      <View className="mx-[20px]  gap-[24px] mt-3 ">
        <OreAppText className="mx-auto text-[20px] leading-[28px] text-[#2D2220]  ">
          Orders
        </OreAppText>

        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <View className="w-[70%] mx-auto mt-[10%] ">
        <Text className="text-[#111827] text-center leading-[20px] font-urbanist-medium text-[14px] ">
          See a complete list of all your past and ongoing orders at a glance.
        </Text>
      </View>

      <View className=" mx-[15px]    ">
        {activeTab === "All Orders" && <AllOrders />}
        {activeTab === "Ongoing orders" && <OngoingOrders />}
        {activeTab === "Completed orders" && <CompletedOrders />}
      </View>
    </ScreenWrapper>
  );
}

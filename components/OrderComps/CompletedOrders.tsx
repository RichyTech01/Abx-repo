import { View, Text, SectionList } from "react-native";
import React from "react";
import OrderCard from "@/common/OrderCard";
import OreAppText from "@/common/OreApptext";

export default function CompletedOrders() {
  const sections = [
    {
      title: "Jul 6, 2025",
      data: [
        {
          orderNumber: "WU88191111",
          datePlaced: "Jul 6, 2025",
          totalAmount: "£160.00",
          status: "delivered",
        },
        {
          orderNumber: "WU88192222",
          datePlaced: "Jul 6, 2025",
          totalAmount: "£200.00",
          status: "delivered",
        },
      ],
    },
    {
      title: "Jul 3, 2025",
      data: [
        {
          orderNumber: "WU88193333",
          datePlaced: "Jul 3, 2025",
          totalAmount: "£80.00",
          status: "delivered",
        },
      ],
    },
    {
      title: "Jun 28, 2025",
      data: [
        {
          orderNumber: "WU88194444",
          datePlaced: "Jun 28, 2025",
          totalAmount: "£120.00",
          status: "delivered",
        },
      ],
    },
  ];

  return (
    <View className="mt-[8%]  ">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.orderNumber}
        renderItem={({ item }) => (
          <View className="mt-[8px]">
            <OrderCard
              orderNumber={item.orderNumber}
              datePlaced={item.datePlaced}
              totalAmount={item.totalAmount}
              status={item.status as "processing" | "shipped" | "delivered"}
              onPressDetail={() => console.log("Go to details")}
            />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View
            className="mt-[20px]"
            style={{
              marginTop: title !== sections[0].title ? 32 : 0,
            }}
          >
            <OreAppText className="text-[#111827] leading-[20px] text-[16px]">
              {title}
            </OreAppText>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 310 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

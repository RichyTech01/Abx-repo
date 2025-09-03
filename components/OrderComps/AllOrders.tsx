import { View, Text, Pressable, SectionList } from "react-native";
import OrderCard from "@/common/OrderCard";
import { useState } from "react";
import OreAppText from "@/common/OreApptext";
import OrderDetails from "./OrderDetails";

export default function AllOrders() {
  const [orderDetails, setOrderDetails] = useState(false);
  const sections = [
    {
      title: "Today",
      data: [
        {
          orderNumber: "WU88191111",
          datePlaced: "Jul 6, 2025",
          totalAmount: "£160.00",
          status: "shipped",
        },
        {
          orderNumber: "WU88192222",
          datePlaced: "Jul 6, 2025",
          totalAmount: "£200.00",
          status: "processing",
        },
      ],
    },
    {
      title: "This week",
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
      title: "Last week",
      data: [
        {
          orderNumber: "WU88194444",
          datePlaced: "Jun 28, 2025",
          totalAmount: "£120.00",
          status: "shipped",
        },
        {
          orderNumber: "WU88195555",
          datePlaced: "Jun 27, 2025",
          totalAmount: "£60.00",
          status: "processing",
        },
      ],
    },
  ];

  return (
    <View className="mt-[8%]  ">
      {orderDetails ? (
        <OrderDetails />
      ) : (
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
                onPressDetail={() => setOrderDetails((prev) => !prev)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View
              className="flex-row items-center justify-between "
              style={{
                marginTop: title !== sections[0].title ? 32 : 0,
              }}
            >
              <OreAppText className="text-[#111827] leading-[20px] text-[16px] ">
                {title}
              </OreAppText>
              <Pressable>
                <Text className="text-[14px] font-urbanist-medium leading-[20px] ">
                  View all orders
                </Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 320 }}
        />
      )}
    </View>
  );
}

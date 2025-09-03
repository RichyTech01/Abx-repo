import { View, FlatList } from "react-native";
import React from "react";
import OrderCard from "@/common/OrderCard";

export default function OngoingOrders() {
  // Example ongoing orders (processing / shipped only)
  const ongoingOrders = [
    {
      orderNumber: "WU99001111",
      datePlaced: "Jul 6, 2025",
      totalAmount: "£75.00",
      status: "processing",
    },
    {
      orderNumber: "WU99002222",
      datePlaced: "Jul 5, 2025",
      totalAmount: "£180.00",
      status: "shipped",
    },
    {
      orderNumber: "WU99003333",
      datePlaced: "Jul 4, 2025",
      totalAmount: "£210.00",
      status: "shipped",
    },
   
  ];


  return (
    <FlatList
      data={ongoingOrders}
      keyExtractor={(item) => item.orderNumber}
      renderItem={({ item }) => (
        <OrderCard
          orderNumber={item.orderNumber}
          datePlaced={item.datePlaced}
          totalAmount={item.totalAmount}
          status={item.status as "processing" | "shipped"}
        />
      )}
      contentContainerStyle={{ gap: 8, paddingBottom: 310, marginTop:"8%" }}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    />
  );
}

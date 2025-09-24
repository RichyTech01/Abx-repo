import { FlatList, View, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import OrderCard from "@/common/OrderCard";
import OrderApi from "@/api/OrderApi";
import dayjs from "dayjs";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useRouter } from "expo-router";

type OrderStatus = "processing" | "delivered";

type Order = {
  id: string;
  order_code: string;
  created_at: string;
  store_total_price: string;
  is_order_fulfilled: boolean;
  status: OrderStatus;
};

export default function OngoingOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOngoingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await OrderApi.getCustomerOrders({ is_completed: false });
      setOrders(res.results || []);
    } catch (err) {
      console.error("Failed to fetch ongoing orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingOrders();
  }, [fetchOngoingOrders]);

  if (loading) {
    return (
      <View className="py-10">
        <LoadingSpinner />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <Text className="text-center mt-10 text-gray-500">No ongoing orders</Text>
    );
  }

  return (
    <View className="mt-[8%]">
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderCard
            orderNumber={item.order_code}
            datePlaced={dayjs(item.created_at).format("MMM D, YYYY")}
            totalAmount={`£${item.store_total_price}`}
            status={
              item.is_order_fulfilled
                ? "delivered"
                : "Your item is being processed"
            }
            onPressDetail={() =>
              router.push({
                pathname: "/Screens/OrderScreen/OrderDetailsScrenn",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={{ gap: 8, paddingBottom: 310 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />
    </View>
  );
}

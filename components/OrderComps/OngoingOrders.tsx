import { FlatList, View, RefreshControl } from "react-native";
import React, { useEffect, useState,  } from "react";
import OrderCard from "@/common/OrderCard";
import OrderApi from "@/api/OrderApi";
import dayjs from "dayjs";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useRouter } from "expo-router";
import NoData from "@/common/NoData";
import Storage from "@/utils/Storage";

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchOngoingOrders = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      const token = await Storage.get("accessToken");
      const guest = await Storage.get("isGuest");

      if (!token || guest) {
        setOrders([]);
        return;
      }

      let page = 1;
      let allOrders: any[] = [];
      let hasNext = true;

      while (hasNext) {
        const res = await OrderApi.getCustomerOrders({
          is_completed: false,
          page,
        });

        allOrders = [...allOrders, ...(res.results || [])];
        hasNext = !!res.next;
        page++;
      }

      setOrders(allOrders);
    } catch (err) {
      console.error("Failed to fetch ongoing orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const HandleRefresh = async () => {
    setRefreshing(true);
    await fetchOngoingOrders(true);
     setRefreshing(false);
  };

  useEffect(() => {
    fetchOngoingOrders();
  }, []);

  if (loading) {
    return (
      <View className="py-10">
        <LoadingSpinner />
      </View>
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
        ListEmptyComponent={
          <View className="justify-center items-center mt-[5%]">
            <NoData
              title="No order history"
              buttonTitle="Start shopping"
              onButtonPress={() =>
                router.push("/Screens/AccountScreen/AllStore")
              }
              subtitle="Looks like you haven't placed an order yet—no worries, that just means the best is yet to come! Start browsing and find something you'll love. We've got plenty of great options waiting for you!"
            />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={HandleRefresh} />
        }
      />
    </View>
  );
}

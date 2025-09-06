import { View, SectionList,  } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import OrderCard from "@/common/OrderCard";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import { groupOrdersByDate, Order, Section } from "@/utils/groupOrdersByDate";
import OrderDetails from "./OrderDetails";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import NoData from "@/common/NoData";
import { useRouter } from "expo-router";

export default function CompletedOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await OrderApi.getCustomerOrders({ is_completed: true });

        const mapped: Order[] = res.results.map((o: any) => ({
          ...o,
          status: "delivered",
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("Error fetching completed orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sections: Section[] = useMemo(
    () => groupOrdersByDate(orders),
    [orders]
  );

  if (loading) {
    return (
      <View className=" justify-center items-center py-10">
        <LoadingSpinner />
      </View>
    );
  }

  if (sections.every((s) => s.data.length === 0)) {
    return (
      <View className="justify-center items-center mt-[20%]">
        <NoData
          title="No order history"
          buttonTitle="Start shopping"
          onButtonPress={() => router.push("/Screens/AccountScreen/AllStore")}
          subtitle="Looks like you haven't placed an order yet—no worries, that just means the best is yet to come! Start browsing and find something you'll love. We've got plenty of great options waiting for you!"
        />
      </View>
    );
  }

  return (
    <View className="mt-[8%] flex-1">
      {selectedOrderId ? (
        <OrderDetails
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(null)}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mt-[8px]">
              <OrderCard
                orderNumber={item.order_code}
                datePlaced={item.created_at}
                totalAmount={`£${item.store_total_price}`}
                status={"delivered"}
                onPressDetail={() => setSelectedOrderId(item.id)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title, data } }) =>
            data.length > 0 ? (
              <View className="mt-[20px]">
                <OreAppText className="text-[#111827] leading-[20px] text-[16px]">
                  {title}
                </OreAppText>
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 310 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

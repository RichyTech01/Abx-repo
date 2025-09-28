import { View, Text, Pressable, SectionList } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import OrderCard from "@/common/OrderCard";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import { groupOrdersByDate, Order, Section } from "@/utils/groupOrdersByDate";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import NoData from "@/common/NoData";
import { useRouter } from "expo-router";
import dayjs from "dayjs";

export default function CompletedOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await OrderApi.getCustomerOrders({ is_completed: true });

        setOrders(res.results);
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

  const toggleExpand = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const getStatus = (order: any) => {
    return {
      text: `Delivered on ${dayjs(order.created_at).format("MMM D, YYYY")}`,
      color: "#059669",
      isDelivered: true,
    };
  };

  if (loading) {
    return (
      <View className="py-10">
        <LoadingSpinner />
      </View>
    );
  }

  if (sections.length === 0) {
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
    <View className="mt-[8%]">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, section }) => {
          const expanded = expandedSections.includes(section.title);
          const index = section.data.indexOf(item);

          // Show first 5 items by default, or all if expanded
          const itemsToShow = expanded
            ? section.data.length
            : Math.min(5, section.data.length);

          // Don't render if this item is beyond our display limit
          if (index >= itemsToShow) return null;

          // Get dynamic status
          const {
            text: statusText,
            color: statusColor,
            isDelivered,
          } = getStatus(item);

          return (
            <View className="mt-[8px]">
              <OrderCard
                orderNumber={item.order_code}
                datePlaced={dayjs(item.created_at).format("MMM D, YYYY")}
                totalAmount={`£${item.store_total_price}`}
                status={statusText}
                statusColor="#059669"
                isDelivered={true}
                onPressDetail={() =>
                  router.push({
                    pathname: "/Screens/OrderScreen/OrderDetailsScrenn",
                    params: { id: item.id },
                  })
                }
              />
            </View>
          );
        }}
        renderSectionHeader={({ section }) => {
          if (section.data.length === 0) return null;

          const expanded = expandedSections.includes(section.title);
          const hasMoreThanFive = section.data.length > 5;

          return (
            <View
              className="flex-row items-center justify-between"
              style={{
                marginTop: section.title !== sections[0]?.title ? 32 : 0,
              }}
            >
              <OreAppText className="text-[#111827] leading-[20px] text-[16px]">
                {section.title}
              </OreAppText>
              {hasMoreThanFive && (
                <Pressable onPress={() => toggleExpand(section.title)}>
                  <Text className="text-[14px] font-urbanist-medium leading-[20px]">
                    {expanded ? "Show less" : `View all orders`}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 320 }}
        ListEmptyComponent={
          <Text className="text-center mt-10 text-gray-500">No orders yet</Text>
        }
      />
    </View>
  );
}

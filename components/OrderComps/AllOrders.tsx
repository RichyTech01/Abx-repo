import { View, Text, Pressable, SectionList } from "react-native";
import OrderCard from "@/common/OrderCard";
import { useEffect, useState, useCallback } from "react";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import dayjs from "dayjs";
import { groupOrdersByDate, Section } from "@/utils/groupOrdersByDate";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useRouter } from "expo-router";

export default function AllOrders() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await OrderApi.getCustomerOrders();
      const orders = res.results || [];
      setSections(groupOrdersByDate(orders));
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const getStatus = (order: any) => {
    const status = order.status;
    
    switch (status) {
      case "pending":
        return {
          text: "Your order is pending",
          color: "#F4B551",
          isDelivered: false,
        };
      case "preparing":
        return {
          text: "Preparing for delivery",
          color: "#F4B551",
          isDelivered: false,
        };
      case "assigned":
        return {
          text: "Rider assigned to Order",
          color: "#DC6C3C",
          isDelivered: false,
        };
      case "ready":
        return {
          text: "Ready for Delivery",
          color: "#2563EB",
          isDelivered: false,
        };
      case "pickedup":
        return {
          text: "Order on the way",
          color: "#6B7280",
          isDelivered: false,
        };
      case "completed":
        return {
          text: `Delivered on ${dayjs(order.created_at).format("MMM D, YYYY")}`,
          color: "#059669",
          isDelivered: true,
        };
      default:
        // Fallback to your existing logic
        return {
          text: order.is_order_fulfilled 
            ? "Delivered" 
            : "Your item is being processed",
          color: order.is_order_fulfilled ? "#059669" : "#F4B551",
          isDelivered: order.is_order_fulfilled,
        };
    }
  };

  return (
    <View className="mt-[8%]">
      {loading ? (
        <View className="py-10 ">
          <LoadingSpinner />
        </View>
      ) : (
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
            const { text: statusText, color: statusColor, isDelivered } = getStatus(item);

            return (
              <View className="mt-[8px]">
                <OrderCard
                  orderNumber={item.order_code}
                  datePlaced={dayjs(item.created_at).format("MMM D, YYYY")}
                  totalAmount={`£${item.store_total_price}`}
                  status={statusText}
                  statusColor={statusColor}
                  isDelivered={isDelivered}
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
            <Text className="text-center mt-10 text-gray-500">
              No orders yet
            </Text>
          }
        />
      )}
    </View>
  );
}
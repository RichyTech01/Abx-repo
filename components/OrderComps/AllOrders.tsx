import {
  View,
  Text,
  Pressable,
  SectionList,
  ActivityIndicator,
} from "react-native";
import OrderCard from "@/common/OrderCard";
import { useEffect, useState, useCallback } from "react";
import OreAppText from "@/common/OreApptext";
import OrderDetails from "./OrderDetails";
import OrderApi from "@/api/OrderApi";
import dayjs from "dayjs";
import { groupOrdersByDate, Section } from "@/utils/groupOrdersByDate";
import { LoadingSpinner } from "@/common/LoadingSpinner";

export default function AllOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  return (
    <View className="mt-[8%]">
      {selectedOrderId ? (
        <OrderDetails
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(null)}
        />
      ) : loading ? (
        <View className="py-10 ">
          <LoadingSpinner />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => {
            const expanded = expandedSections.includes(section.title);
            const index = section.data.indexOf(item);

            if (!expanded && index > 0) return null;

            return (
              <View className="mt-[8px]">
                <OrderCard
                  orderNumber={item.order_code}
                  datePlaced={dayjs(item.created_at).format("MMM D, YYYY")}
                  totalAmount={`£${item.store_total_price}`}
                  status={item.is_order_fulfilled ? "delivered" : "processing"}
                  onPressDetail={() => setSelectedOrderId(item.id)}
                />
              </View>
            );
          }}
          renderSectionHeader={({ section }) => {
            if (section.data.length === 0) return null;

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
                {section.data.length > 1 && (
                  <Pressable onPress={() => toggleExpand(section.title)}>
                    <Text className="text-[14px] font-urbanist-medium leading-[20px]">
                      {expandedSections.includes(section.title)
                        ? "See less"
                        : "View all orders"}
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

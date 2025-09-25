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

            // Show first 10 items by default, or all if expanded
            const itemsToShow = expanded
              ? section.data.length
              : Math.min(5, section.data.length);

            // Don't render if this item is beyond our display limit
            if (index >= itemsToShow) return null;
            return (
              <View className="mt-[8px]">
                <OrderCard
                  orderNumber={item.order_code}
                  datePlaced={dayjs(item.created_at).format("MMM D, YYYY")}
                  totalAmount={`£${item.store_total_price}`}
                  status={item.is_order_fulfilled ? "delivered" : "Your item is being processed"}
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
            const hasMoreThanTen = section.data.length > 5;

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
                {hasMoreThanTen && (
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

import {
  View,
  Text,
  Pressable,
  SectionList,
  RefreshControl,
} from "react-native";
import OrderCard from "@/common/OrderCard";
import { useEffect, useState } from "react";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import dayjs from "dayjs";
import { groupOrdersByDate, Section } from "@/utils/groupOrdersByDate";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useRouter } from "expo-router";
import NoData from "@/common/NoData";
import Storage from "@/utils/Storage";

export default function AllOrders() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      const token = await Storage.get("accessToken");
      const guest = await Storage.get("isGuest");
      if (!token || guest) {
        setLoading(false);
        setSections([]);
        return;
      }

      let page = 1;
      let allOrders: any[] = [];
      let hasNext = true;

      while (hasNext) {
        const res = await OrderApi.getCustomerOrders({ page });
        const orders = res.results || [];

        allOrders = [...allOrders, ...orders];

        hasNext = !!res.next;
        page++;
      }

      setSections(groupOrdersByDate(allOrders));
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const HandleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(true);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
          color: "#DC6C3C",
          isDelivered: false,
        };
      case "completed":
        return {
          text: `Delivered on ${dayjs(order.created_at).format("MMM D, YYYY")}`,
          color: "#059669",
          isDelivered: true,
        };
      default:
        return {
          text: order.is_order_fulfilled
            ? "Delivered"
            : "Your item is being processed",
          color: order.is_order_fulfilled ? "#059669" : "#F4B551",
          isDelivered: order.is_order_fulfilled,
        };
    }
  };

  if (loading) {
    return (
      <View className="py-10">
        <LoadingSpinner />
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

          const itemsToShow = expanded
            ? section.data.length
            : Math.min(5, section.data.length);

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

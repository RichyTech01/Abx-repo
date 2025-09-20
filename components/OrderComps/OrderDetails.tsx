import { View, Text, ScrollView, Image, Pressable } from "react-native";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import ShippedForDeliveryIcon from "@/assets/svgs/ShippedForDeliveryIcon.svg";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";
import Button from "@/common/Button";
// import OrderProccessingIcon from "../../assets/svgs/OrderProcessingIcon.svg";
import TrackingTimeline from "@/common/TrackingTimeline";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import BacIcon from "../../assets/svgs/BackArrow.svg";
import showToast from "@/utils/showToast";
import OrderApi from "@/api/OrderApi";
import { LoadingSpinner } from "@/common/LoadingSpinner";


type OrderDetailsProps = {
  orderId: string;
  onBack: () => void;
};


export default function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const [order, setOrder] = useState<any | null>(null);
  console.log(orderId)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await OrderApi.getCustomerOrderById(orderId);
        setOrder(res);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleConfirmDelivery = async () => {
    try {
      await OrderApi.completeCustomerOrder(orderId);

      setOrder((prev: any) => (prev ? { ...prev, status: "delivered" } : prev));

      showToast("success", "Order marked as delivered.");
    } catch (err) {
      console.error("Failed to complete order:", err);
      showToast("error", "Failed to confirm delivery. Please try again.");
    }
  };

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center">
         <LoadingSpinner />
      </View>
    );
  }

  // helper for status
  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Your order is pending",
          color: "#F4B551",
          Icon: ProcessingIcon,
        };
      case "processing":
        return {
          text: "Your order is being processed",
          color: "#F4B551",
          Icon: ProcessingIcon,
        };
      case "shipped":
        return {
          text: "Your item has been shipped for delivery",
          color: "#DC6C3C",
          Icon: ShippedForDeliveryIcon,
        };
      case "delivered":
        return {
          text: "Your order has been delivered",
          color: "#C4C4C4",
          Icon: DeliveredIcon,
        };
      default:
        return {
          text: "Unknown status",
          color: "#6B7280",
          Icon: ProcessingIcon,
        };
    }
  };

  const {
    text: statusText,
    color: statusColor,
    Icon: StatusIcon,
  } = getStatus(order.status);

  return (
    <>
      <View className="flex-row items-center gap-2">
        <Pressable
          className="w-7 h-7 items-start justify-center "
          onPress={onBack}
        >
          <BacIcon />
        </Pressable>
        <OreAppText className="text-[16px] leading-[20px] text-[#111827]">
          {dayjs(order.created_at).isSame(dayjs(), "day")
            ? "Today"
            : dayjs(order.created_at).format("MMM D, YYYY")}
        </OreAppText>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 350 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white mt-[26px]">
          {/* Order info row */}
          <View className="border border-[#F1EAE7] rounded-[8px] px-[10px] py-[10px] flex-row items-center justify-between gap-1">
            <View>
              <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                Order number
              </Text>
              <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                {order.order_code}
              </UrbanistText>
            </View>
            <View className="ml-[4px] flex  flex-col items-center ">
              <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                Store ID
              </Text>
              <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                ABX
              </UrbanistText>
            </View>
            <View className="ml-[4px]">
              <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                Date placed
              </Text>
              <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                {dayjs(order.created_at).format("MMM D, YYYY")}
              </UrbanistText>
            </View>
            <View className="ml-[4px]">
              <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
                Total amount
              </Text>
              <Text className="text-[14px] leading-[20px] text-[#111827] mt-[4px] font-urbanist-medium ">
                £{order.grand_total}
              </Text>
            </View>
          </View>

          {/* Items */}
          <View className="mt-[8px] px-[10px]">
            {order.orderitems.map((item: any) => (
              <View key={item.id} className="flex-row items-center py-[16px]">
                <View className="h-[107px] w-[146px] ">
                  <Image
                    source={{ uri: item.item_img }}
                    style={{ width: "100%", height: 107, borderRadius: 8 }}
                  />
                </View>

                <View className="ml-[15px]">
                  <Text className="text-[#4D4D4D] text-[16px] font-urbanist-medium">
                    {item.item_name}
                  </Text>
                  <Text className="text-[#2D2220] text-[14px] font-urbanist-semibold mt-[4px]">
                    €{item.listed_price}
                  </Text>
                  <View className="bg-[#FDF0DC] rounded-[8px] p-[4px] mt-[8px]">
                    <UrbanistText className="text-[12px] text-[#424242]">
                      {item.quantity} x {item.item_weight}kg
                    </UrbanistText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Status row */}
          <View className="flex-row items-center ml-[28px] my-[8px]">
            <StatusIcon />
            <UrbanistText
              className="ml-[4px] text-[12px]"
              style={{ color: statusColor }}
            >
              {statusText}
            </UrbanistText>
          </View>

          {/* Timeline */}
          <View className="border-t border-[#F1EAE7] bg-white py-[16px]">
            <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium px-[8px]">
              Delivery timeline
            </Text>
          </View>
          <View className="mt-[12px]">
            <TrackingTimeline status={order.status} />
          </View>
        </View>

        <View className="mt-[8%]">
          <Button
            title="Click to confirm item delivery"
            onPress={handleConfirmDelivery}
            disabled={order.status !== "shipped"}
          />
        </View>
      </ScrollView>
    </>
  );
}

import ScreenWrapper from "@/common/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Image } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";
import Button from "@/common/Button";
// import OrderProccessingIcon from "../../assets/svgs/OrderProcessingIcon.svg";
import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import CompletedHistoryTimeline from "@/components/OrderComps/CompletedHistoryTimeline";

import TrackingTimeline from "@/common/TrackingTimeline";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import showToast from "@/utils/showToast";
import OrderApi from "@/api/OrderApi";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Header from "@/common/Header";
import PaymentSuccessModal from "@/Modals/PaymentSuccessModal";
import { useRouter } from "expo-router";

export default function OrderDetailsScrenn() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ConfirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchOrder = async () => {
      try {
        const res = await OrderApi.getCustomerOrderById(id);
        setOrder(res);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };
    fetchOrder();
  }, [id]);

  const handleConfirmDelivery = async () => {
    setConfirmLoading(true);
    try {
      await OrderApi.completeCustomerOrder(id);

      // Optimistically update the order status immediately
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: "completed",
      }));

      setShowModal((prev) => !prev);
      // Optionally fetch fresh data in the background (but don't wait for it)
      OrderApi.getCustomerOrderById(id)
        .then((refreshedOrder) => {
          setOrder(refreshedOrder);
        })
        .catch((err) => {
          console.error("Failed to refresh order data:", err);
        });
    } catch (err) {
      console.error("Failed to complete order:", err);
      showToast("error", "Failed to confirm delivery. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  // helper for status
  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Your order is pending",
          color: "#F4B551",
          Icon: ProcessingIcon,
        };
      case "preparing":
        return {
          text: "Preparing for delivery",
          color: "#F4B551",
          Icon: ProcessingIcon,
        };
      case "assigned":
        return {
          text: "Rider assigned to Order",
          color: "#DC6C3C",
          Icon: ProcessingIcon,
        };
      case "ready":
        return {
          text: "Ready for Delivered",
          color: "",
          Icon: ProcessingIcon,
        };
      case "pickedup":
        return {
          text: "Order on the way",
          color: "#6B7280",
          Icon: ProcessingIcon,
        };
      case "completed":
        return {
          text: `Delivered on ${dayjs(order?.created_at).format(
            "MMM D, YYYY"
          )}`,
          color: "#6B7280",
          Icon: DeliveredIcon,
        };
      default:
        return {
          text: "Unknown status",
          color: "#999999",
          Icon: ProcessingIcon,
        };
    }
  };

  const {
    text: statusText,
    color: statusColor,
    Icon: StatusIcon,
  } = getStatus(order?.status || "");

  return (
    <ScreenWrapper>
      <Header title="Orders Detail" />
      <>
        {/* <View className="flex-row items-center gap-2 mx-[20px]  ] mt-3">
      
          <OreAppText className="text-[16px] leading-[20px] text-[#111827]">
            {dayjs(order.created_at).isSame(dayjs(), "day")
              ? "Today"
              : dayjs(order?.created_at).format("MMM D, YYYY")}
          </OreAppText>
        </View> */}

        {loading ? (
          <View className="flex-1 justify-center items-center py-10 ">
            <LoadingSpinner />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-white mt-[20px]">
              {/* Order info row */}
              <View className="border border-[#F1EAE7] rounded-[8px] px-[10px] py-[10px]">
                {/* First Row */}
                <View className="flex-row items-center justify-between gap-4 mb-[16px]">
                  <View className="flex-1">
                    <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                      Order number
                    </Text>
                    <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                      {order?.order_code}
                    </UrbanistText>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                      Store ID
                    </Text>
                    <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                      {order?.store_id}
                    </UrbanistText>
                  </View>
                </View>

                {/* Second Row */}
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1">
                    <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                      Date placed
                    </Text>
                    <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                      {dayjs(order?.created_at).format("MMM D, YYYY")}
                    </UrbanistText>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
                      Total amount
                    </Text>
                    <Text className="text-[14px] leading-[20px] text-[#111827] mt-[4px] font-urbanist-medium">
                      £{order?.grand_total}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Items */}
              <View className="mt-[8px] px-[10px]">
                {order?.orderitems.map((item: any) => (
                  <View
                    key={item.id}
                    className="flex-row items-center py-[16px]"
                  >
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
                      <View className="bg-[#FDF0DC] rounded-[8px] p-[4px] mt-[8px] self-start">
                        <UrbanistText className="text-[12px] text-[#424242]">
                          {item.quantity} x {item.item_weight}kg
                        </UrbanistText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Status row */}
              {/* <Text>Total Quantity of items: 30.5kg</Text> */}

              <View className="flex-row items-center ml-[8px] my-[8px] ">
                <StatusIcon />
                <UrbanistText
                  className="ml-[4px] text-[12px] "
                  style={{
                    color:
                      order?.status === "completed" ? "#05A85A" : "#F8A84C",
                  }}
                >
                  {statusText}
                </UrbanistText>
              </View>

              {/* Timeline */}
              {order?.status === "completed" ? null : (
                <View>
                  <View className="border-t border-[#F1EAE7] bg-white pt-[16px]">
                    <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium px-[8px]">
                      Delivery timeline
                    </Text>
                  </View>
                  <View className="mt-[12px]">
                    <TrackingTimeline status={order?.status} />
                  </View>
                </View>
              )}
            </View>

            <View>
              {order?.status === "completed" ? (
                <View>
                  <CompletedHistoryTimeline />
                </View>
              ) : null}
            </View>

            {order?.status === "completed" ||
            order?.status !== "pickedup" ? null : (
              <View className="mt-[8%]">
                <Button
                  title="Click to confirm item delivery"
                  onPress={handleConfirmDelivery}
                  loading={ConfirmLoading}
                  disabled={order?.status !== "pickedup" || ConfirmLoading}
                />
              </View>
            )}
          </ScrollView>
        )}
      </>
      <PaymentSuccessModal
        visible={showModal}
        content="Order Confirmed"
        secondButtonTitle="Cancel"
        onPress={() =>
          router.push({
            pathname: "/Screens/OrderScreen/WriteReviewScreen",
            params: { storeId: order?.store_id },
          })
        }
        tittle="Write a Review"
        onClose={() => setShowModal((prev) => !prev)}
        onSecondPress={() => console.log("Secondary pressed")}
      />
    </ScreenWrapper>
  );
}

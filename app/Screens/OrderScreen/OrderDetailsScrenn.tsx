import ScreenWrapper from "@/common/ScreenWrapper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  Linking,
  TouchableOpacity,
} from "react-native";
import UrbanistText from "@/common/UrbanistText";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";
import Button from "@/common/Button";
import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import CompletedHistoryTimeline from "@/components/OrderComps/CompletedHistoryTimeline";
import TrackingTimeline from "@/common/TrackingTimeline";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import showToast from "@/utils/showToast";
import OrderApi from "@/api/OrderApi";
import Header from "@/common/Header";
import PaymentSuccessModal from "@/Modals/PaymentSuccessModal";
import { useRouter } from "expo-router";
import MQTTClient from "@/utils/mqttClient";
import { useUserStore } from "@/store/useUserStore";
import type { Notification } from "@/types/NotificationType";
import { OrderSkeleton } from "@/common/OrderSkeleton";

export default function OrderDetailsScrenn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { user } = useUserStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ConfirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const { data: order, isLoading: loading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await OrderApi.getCustomerOrderById(id);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });

  useEffect(() => {
    if (!user?.id || !id || !MQTTClient.isClientConnected()) return;

    const orderSpecificCallback = (notification: Notification) => {
      const notificationOrderId = notification.data?.order_id?.toString();
      const currentOrderId = id?.toString();

      if (notificationOrderId === currentOrderId) {
        if (notification.data?.status) {
          queryClient.setQueryData(["order", id], (oldData: any) => ({
            ...oldData,
            status: notification.data.status,
          }));
        }

        queryClient.invalidateQueries({ queryKey: ["order", id] });
      }
    };

    MQTTClient.addCallback(orderSpecificCallback);

    return () => {
      MQTTClient.removeCallback(orderSpecificCallback);
    };
  }, [user?.id, id, queryClient]);

  const handleConfirmDelivery = async () => {
    setConfirmLoading(true);
    try {
      await OrderApi.completeCustomerOrder(id);

      queryClient.setQueryData(["order", id], (oldData: any) => ({
        ...oldData,
        status: "completed",
      }));

      setShowModal(true);

      queryClient.invalidateQueries({ queryKey: ["order", id] });
    } catch (err) {
      console.error("Failed to complete order:", err);
      showToast("error", "Failed to confirm delivery. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleReviewProduct = (product: any) => {
    router.push({
      pathname: "/Screens/OrderScreen/WriteOrderProductReview",
      params: {
        productId: product.productId,
        productName: product.item_name,
        productImage: product.item_img,
        productPrice: product.price,
        orderId: id,
      },
    });
  };

  const handleReviewStore = () => {
    router.push({
      pathname: "/Screens/OrderScreen/WriteReviewScreen",
      params: { storeId: order?.store_id },
    });
  };

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

  const showConfirmButton = order?.status === "pickedup";
  const showButtons = order?.status === "assigned" || showConfirmButton;

  return (
    <ScreenWrapper>
      <Header title="Orders Detail" />
      <View style={{ flex: 1 }}>
        {loading ? (
          <OrderSkeleton />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: showButtons ? 130 : 50,
                paddingHorizontal: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white mt-[20px]">
                {/* Order info row */}
                <View className="border border-[#F1EAE7] rounded-[8px] px-[10px] py-[10px]">
                  {/* First Row */}
                  <View className="flex-row items-center justify-between gap-4 mb-[16px]">
                    <View className="flex-1">
                      <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                        Order code
                      </Text>
                      <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                        {order?.order_code}
                      </UrbanistText>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                        Store code
                      </Text>
                      <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                        {order?.store_code}
                      </UrbanistText>
                    </View>
                  </View>

                  {/* Second Row */}
                  <View className="flex-row items-center justify-between gap-4 mb-[16px] ">
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

                  {order?.rider && (
                    <View className="flex-row items-center justify-between gap-4 mb-[16px]">
                      <View className="flex-1">
                        <Text className="text-[14px] font-urbanist-medium text-[#111827]">
                          Rider name
                        </Text>
                        <UrbanistText className="text-[14px] leading-[20px] text-[#6B7280] mt-[4px]">
                          {order?.rider?.first_name} {order?.rider?.last_name}
                        </UrbanistText>
                      </View>
                      <View className="flex-1">
                        <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827] mb-[4px]">
                          Call rider
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const phoneNumber = order?.rider?.phone_number;
                            if (phoneNumber) {
                              Linking.openURL(`tel:${phoneNumber}`).catch(
                                (err) => {
                                  // console.error("Failed to open dialer:", err);
                                  showToast(
                                    "error",
                                    "Failed to open phone dialer"
                                  );
                                }
                              );
                            }
                          }}
                          className="flex-row items-center bg-[#FDF0DC] rounded-[8px] px-[12px] py-[8px] self-start"
                          activeOpacity={0.7}
                        >
                          <Text className="text-[14px]">📞</Text>
                          <Text className="text-[14px] leading-[20px] text-[#DC6C3C] font-urbanist-semibold ml-[6px]">
                            {order?.rider?.phone_number}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Items */}
                <View className="mt-[8px] px-[10px]">
                  {order?.orderitems.map((item: any) => (
                    <View
                      key={item.id}
                      className="flex-row items-center py-[16px] border-b border-[#F1EAE7]"
                    >
                      <View className="h-[107px] w-[146px] ">
                        <Image
                          source={{ uri: item.item_img }}
                          style={{
                            width: "100%",
                            height: 107,
                            borderRadius: 8,
                          }}
                        />
                      </View>

                      <View className="ml-[26px] flex-1">
                        <Text className="text-[#4D4D4D] text-[16px] font-urbanist-medium  flex-wrap ">
                          {item.item_name}
                        </Text>
                        <Text className="text-[#2D2220] text-[14px] font-urbanist-semibold mt-[4px]">
                          €{item.price}
                        </Text>
                        <View className="bg-[#FDF0DC] rounded-[8px] p-[4px] mt-[8px] self-start">
                          <UrbanistText className="text-[12px] text-[#424242]">
                            {item.quantity} x {item.item_weight}kg
                          </UrbanistText>
                        </View>

                        {order?.status === "completed" && (
                          <View className="mt-[8px]">
                            <Button
                              title="Rate Product"
                              onPress={() => handleReviewProduct(item)}
                              style={{
                                paddingVertical: 6,
                                minHeight: 36,
                              }}
                              textStyle={{ fontSize: 12 }}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>

                {/* Status row */}
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

                {order?.status === "completed" ? null : (
                  <View className="mb-7 ">
                    <View className="border-t border-[#F1EAE7] bg-white pt-[16px]">
                      <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium px-[8px]">
                        Delivery timeline
                      </Text>
                    </View>
                    <View className="mt-[12px]  ">
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
            </ScrollView>

            {showButtons && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 20,
                  paddingTop: 12,
                  paddingBottom: 20,
                  backgroundColor: "white",
                }}
              >
                {order?.status !== "completed" && (
                  <View className="p-2 bg-white rounded-lg border border-[#F1EAE7] mb-3">
                    <Text className="text-[14px] font-orelega my-2">
                      Share your order code with the rider to confirm ownership,
                      and on receiving the package click the button below to
                      confirm the delivery.
                    </Text>
                  </View>
                )}

                {showConfirmButton && (
                  <Button
                    title="Click when you receive your order"
                    onPress={handleConfirmDelivery}
                    loading={ConfirmLoading}
                    disabled={ConfirmLoading}
                  />
                )}
              </View>
            )}
          </>
        )}
      </View>
      <PaymentSuccessModal
        visible={showModal}
        content="Order Confirmed"
        secondButtonTitle="Cancel"
        onPress={handleReviewStore}
        tittle="Rate Store"
        onClose={() => setShowModal(false)}
        onSecondPress={() => setShowModal(false)}
      />
    </ScreenWrapper>
  );
}

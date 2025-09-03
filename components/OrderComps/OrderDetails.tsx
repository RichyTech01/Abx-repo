import { View, Text, ScrollView } from "react-native";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import DetaislImg from "@/assets/svgs/detailsImg.svg";
import ProcessingIcon from "@/assets/svgs/OrderProcessingIcon.svg";
import ShippedForDeliveryIcon from "@/assets/svgs/ShippedForDeliveryIcon.svg";
import DeliveredIcon from "@/assets/svgs/OrderDeliveredIcon.svg";
import Button from "@/common/Button";
import PendingIvon from "@/assets/svgs/OrderPendingIcon.svg";
import TrackingOrderIcon from "@/assets/svgs/TrackingOrderIcon";
import TrackingTimeline from "@/common/TrackingTimeline";

export default function OrderDetails() {
  //   const getStatus = () => {
  //     switch (status) {
  //       case "processing":
  //         return {
  //           text: "Your order is being processed",
  //           color: "#F4B551",
  //           Icon: ProcessingIcon,
  //         };
  //       case "shipped":
  //         return {
  //           text: "Your item has been shipped for delivery",
  //           color: "#DC6C3C",
  //           Icon: ShippedForDeliveryIcon,
  //         };
  //       case "delivered":
  //         return {
  //           text: "Your order has been delivered",
  //           color: "#C4C4C4",
  //           Icon: DeliveredIcon,
  //         };
  //       default:
  //         return {
  //           text: "Unknown status",
  //           color: "#6B7280",
  //           Icon: ProcessingIcon,
  //         };
  //     }
  //   };
  //     const { text, color, Icon } = getStatus();

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 300 }}
      showsVerticalScrollIndicator={false}
    >
      <OreAppText className="text-[16px] leading-[20px] text-[#111827]  ">
        Today
      </OreAppText>

      <View className="bg-white ">
        <View className="border border-[#F1EAE7] rounded-[8px] px-[10px] py-[10px] flex-row items-center justify-between  ">
          <View>
            <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
              Order number
            </Text>
            <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
              WU88191111
            </UrbanistText>
          </View>
          <View className="ml-[4px]">
            <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]  ">
              Store ID
            </Text>
            <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
              ABX 0097
            </UrbanistText>
          </View>
          <View className="ml-[4px]">
            <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
              Date placed
            </Text>
            <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
              Jul 6, 2025
            </UrbanistText>
          </View>
          <View className="ml-[4px]">
            <Text className="text-[14px] leading-[20px] font-urbanist-medium text-[#111827]">
              Total amount
            </Text>
            <UrbanistText className="text-[12px] leading-[16px] text-[#6B7280] mt-[4px]">
              £160.00
            </UrbanistText>
          </View>
        </View>

        <View className="mt-[8px] px-[10px]">
          <View className="flex-row items-center  py-[16px]">
            <View>
              <DetaislImg />
            </View>
            <View className="ml-[15px] ">
              <Text className="text-[#4D4D4D] leading-[22px] text-[16px]  font-urbanist-medium ">
                Broccoli
              </Text>
              <Text className="text-[#2D2220] leading-[20px] text-[14px]  font-urbanist-semibold mt-[4px]">
                €30.00
              </Text>
              <View className="bg-[#FDF0DC] rounded-[8px] p-[4px] mt-[8px] ">
                <UrbanistText className="text-[12px] leading-[16px] text-[#424242]  ">
                  1kg of tomatoes
                </UrbanistText>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row items-center ml-[28px] my-[8px] ">
          <ProcessingIcon />
          <UrbanistText className="text-[#F4B551] text-[12px] leading-[16px] ml-[4px] ">
            Your items are being processed
          </UrbanistText>
        </View>
        <View className="border-t border-[#F1EAE7] rounded-[4px] bg-white py-[16px] ">
          <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium leading-[16px] px-[8px]">
            Delivery timeline
          </Text>
        </View>
        <View className="mt-[12px] ">
          <TrackingTimeline />
        </View>
      </View>

      <View className="mt-[8%] ">
        <Button title="Click to confirm item delivery" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}

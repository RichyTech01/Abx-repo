import { View, Text } from "react-native";
import PendingIcon from "@/assets/svgs/OrderPendingIcon.svg";
import TrackingOrderIcon from "@/assets/svgs/TrackingOrderIcon";

interface TrackingStep {
  title: string;
  description: string;
  active?: boolean;
}

interface TrackingTimelineProps {
  status: "pending" | "processing" | "shipped" | "delivered";
}

export default function TrackingTimeline({ status }: TrackingTimelineProps) {
  const steps: TrackingStep[] = [
    {
      title: "Order Pending",
      description: "You are yet to accept this order request",
    },
    {
      title: "Order processing",
      description: "Vendor is preparing your order",
    },
    {
      title: "Rider assigned to order",
      description: "Payment has been successfully processed and verified",
    },
    {
      title: "Rider picked up order",
      description: "Rider has collected the items",
    },
    {
      title: "Order is in transit",
      description: "A rider is in transit with the customer’s order",
    },
    {
      title: "Order completed",
      description: "The order process has been completed",
    },
  ];

  const activeSteps = (() => {
    switch (status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 4;
      case "delivered":
        return 6;
      default:
        return 0;
    }
  })();

  return (
    <View className="pb-[16px] px-[8px]">
      {steps.map((step, index) => (
        <View
          key={index}
          className={`flex-row gap-[16px] ${index > 0 ? "mt-[2px]" : ""}`}
        >
          <View className="items-center flex-col gap-[2px]">
            {index === 0 ? (
              <PendingIcon />
            ) : (
              <TrackingOrderIcon
                stroke={index < activeSteps ? "#05A85A" : "#C4C4C4"}
              />
            )}
            {index !== steps.length - 1 && (
              <View
                className={`h-[30px] w-[3px] ${
                  index < activeSteps - 1 ? "bg-[#05A85A]" : "bg-[#C4C4C4]"
                } rounded-[22px]`}
              />
            )}
          </View>

          <View className="gap-[4px]">
            <Text className="text-[12px] leading-[16px] font-urbanist-bold text-[#2D2220]">
              {step.title}
            </Text>
            <Text className="text-[12px] leading-[16px] font-urbanist-medium text-[#7D7D7D]">
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

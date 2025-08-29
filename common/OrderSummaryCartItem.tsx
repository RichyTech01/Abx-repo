import React from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import UrbanistText from "@/common/UrbanistText";

type OrderSummaryCartItemProps = {
  title: string;
  weight: string;
  quantity: number;
  price: string;
  image: ImageSourcePropType;
};

const OrderSummaryCartItem: React.FC<OrderSummaryCartItemProps> = ({
  title,
  weight,
  quantity,
  price,
  image,
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-[5.14px]">
        <Image source={image} className="h-[51.4px] w-[51.4px] rounded-full" />
        <UrbanistText className="text-[12px] text-[#1A1A1A] leading-[17.14px]">
          {title}
          {"\u00A0\u00A0"}
          {weight}
          {"\u00A0\u00A0"}x{quantity}
        </UrbanistText>
      </View>

      <UrbanistText className="text-[12px] text-[#1A1A1A] leading-[17.14px]">
        {price}
      </UrbanistText>
    </View>
  );
};

export default OrderSummaryCartItem;

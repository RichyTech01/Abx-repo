import React from "react";
import { View, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import BlackAddTocartIcon from "@/assets/svgs/BlackAddToCart.svg";

type CartItemCardProps = {
  image?: ImageSourcePropType;                
  name?: string;
  price: string;
  quantity: number;
  unit?: string;            
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItemCard({
  image,
  name,
  price,
  quantity,
  unit,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  return (
    <View className="px-[12px] py-[8px] bg-white rounded-[8px]">
      <View className="flex-row items-center p-[8px]">
        <View className="w-[148px] h-[118px] items-center justify-center">
          <View className="bg-[#F6C16E] h-[24px] w-[24px] rounded-full absolute z-10 items-center justify-center right-0 top-0">
            <UrbanistText className="text-[13px] leading-[22px] text-[#000]">
              {quantity}
            </UrbanistText>
          </View>
          <Image
            source={image}
            className="h-[94.6px] w-[133px] rounded-[8px]"
          />
        </View>

        <View className="ml-[18px] flex-1">
          <UrbanistText
            className="text-[16px] leading-[22px] text-[#4D4D4D]"
            style={{ fontFamily: "UrbanistMedium" }}
          >
            {name}
          </UrbanistText>
          <UrbanistText
            className="text-[14px] leading-[20px] text-[#2D2220] mt-[4px]"
            style={{ fontFamily: "UrbanistSemiBold" }}
          >
            {price}
          </UrbanistText>
          {unit && (
            <View className="p-[4px] bg-[#FDF0DC] rounded-[8px] items-center justify-center mt-[8px] self-start">
              <UrbanistText className="text-[#424242] text-[12px] leading-[16px]">
                {unit}
              </UrbanistText>
            </View>
          )}
        </View>
      </View>

      <View className="mx-[17px]">
        <View className="border border-[#E6E6E6] px-[8px] py-[5.5px] rounded-[170px] mt-[16px] flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onDecrease}
            className={`rounded-full h-[34px] w-[34px] items-center justify-center bg-[#F2F2F2]`}
          >
            <View
              className={`h-[1.5px] w-[9.33px] ${
                quantity <= 1 ? "bg-[#999999]" : "bg-[#666666]"
              }`}
            />
          </TouchableOpacity>

          <UrbanistText className="text-[#2D2220] text-[16px] leading-[22px]">
            {quantity}
          </UrbanistText>

          <TouchableOpacity
            onPress={onIncrease}
            className="bg-[#F2F2F2] rounded-full h-[34px] w-[34px] items-center justify-center"
          >
            <BlackAddTocartIcon />
          </TouchableOpacity>
        </View>

        <View className="mt-[10px]">
          <Button
            title="Remove Item"
            backgroundColor="#EFEFEF"
            textColor="#2D2220"
            borderColor="#E6E6E6"
            onPress={onRemove}
            fontClassName="urbanist"
            borderRadius={30}
          />
        </View>
      </View>
    </View>
  );
}

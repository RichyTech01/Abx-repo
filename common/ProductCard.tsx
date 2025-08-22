import { View, Text, Pressable } from "react-native";
import React from "react";
import DropDownArrow from "@/assets/svgs/DropDownArrow";
import Product from "@/assets/svgs/Product";
import StarIcon from "@/assets/svgs/StarIcon.svg";
import Carticon from "@/assets/svgs/Carticon";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";

type ProductCardProps = {
  productName: string;
  priceRange: string;
  saleText?: string; 
  isOutOfStock?: boolean;
  isShopOpen?: boolean;
  rating?: number;
  sizes?: number;
  onAddToCart: () => void;
};

export default function ProductCard({
  productName,
  priceRange,
  saleText = "Sale 50%",
  isOutOfStock = false,
  isShopOpen = true,
  rating = 0,
  sizes = 0,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();

  return (
    <View className="bg-white border border-[#E6E6E6] p-[10px] w-[254px] rounded-[8px]">
      <View className="flex-row items-center justify-between">
        <View
          className="py-[2px] px-[8px] rounded-[4px]"
          style={{
            backgroundColor: isOutOfStock ? "#F04438" : "#F4B551",
          }}
        >
          <Text className="text-[12px] leading-[16px] font-urbanist text-white">
            {isOutOfStock ? "Out of stock" : saleText}
          </Text>
        </View>

        <Text
          className="text-[12px] leading-[16px] font-urbanist"
          style={{
            color: isShopOpen ? "#05A85A" : "#F04438",
          }}
        >
          {isShopOpen ? "Shop open" : "Shop closed"}
        </Text>
      </View>

      {/* Product Image */}
      <Pressable className="mx-auto pt-[18px] pb-[13px]">
        <Product />
      </Pressable>

      {/* Info Row */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#4D4D4D]">
            {productName}
          </Text>
          <Text className="text-[12px] leading-[16px] font-urbanist-semibold text-[#2D2220] mt-[8px]">
            {priceRange}
          </Text>
        </View>

        <View>
          {/* Rating */}
          <View className="flex-row items-center justify-end">
            <StarIcon />
            <Text className="text-[12px] leading-[16px] font-urbanist text-[#424242] ml-[2px]">
              {rating.toFixed(1)}
            </Text>
          </View>
          {/* Sizes */}
          <View className="p-[4px] bg-[#F2F2F2] rounded-[8px] flex-row items-center gap-[8.5px] mt-[8px]">
            <Text className="text-[12px] leading-[16px] text-[#424242] font-urbanist">
              Sizes: {sizes}
            </Text>
            <DropDownArrow />
          </View>
        </View>
      </View>

      {/* Add to cart */}
      <View className="pt-[12px]">
        <IconButton
          label="Add to cart"
          icon={<Carticon />}
          onPress={onAddToCart}
        />
      </View>
    </View>
  );
}

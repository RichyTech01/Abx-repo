import {
  View,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import DropDownArrow from "@/assets/svgs/DropDownArrow";
import StarIcon from "@/assets/svgs/StarIcon.svg";
import Carticon from "@/assets/svgs/Carticon";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { isStoreOpen } from "@/utils/storeStatus";

type ProductCardProps = {
  productName: string;
  priceRange: string;
  discountPercent?: string | null;
  isOutOfStock?: boolean;
  isShopOpen?: boolean;
  rating?: number;
  distance?: number;
  ProductImg: ImageSourcePropType;
  onAddToCart: () => void;
  store_open: string;
  store_close?: string;
  productId: string;
};

export default function ProductCard({
  productName,
  priceRange,
  discountPercent,
  rating = 0,
  distance = 0,
  onAddToCart,
  ProductImg,
  store_open,
  store_close,
  productId,
}: ProductCardProps) {
  const router = useRouter();
  const isOpen = isStoreOpen(store_open, store_close);
  return (
    <View className="bg-white border border-[#E6E6E6] p-[10px] w-[254px] rounded-[8px]  ">
      <View className="flex-row items-center justify-between">
        {/* Discount / Stock Badge */}
        {discountPercent ? (
          <View className="py-[2px] px-[8px] rounded-[4px] bg-[#F4B551]">
            <Text className="text-[12px] leading-[16px] font-urbanist text-white">
              Sale {discountPercent}%
            </Text>
          </View>
        ) : (
          <View style={{ width: 1 }} />
        )}

        {/* Shop status */}
        <Text
          className="text-[12px] leading-[16px] font-urbanist"
          style={{
            color: isOpen ? "#05A85A" : "#F04438",
          }}
        >
          {isOpen ? "Shop open" : "Closed"}
        </Text>
      </View>

      {/* Product Image */}
      <Pressable
        className="mx-auto pt-[18px] pb-[13px] w-full "
        disabled={!isOpen}
        onPress={() =>
          router.push(`/Screens/HomeScreen/ProductDetails?id=${productId}`)
        }
      >
        <Image
          source={ProductImg}
          style={{ opacity: !isOpen ? 0.5 : 1 }}
          className="h-[130px] w-full rounded-[8px]  "
        />
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
          <Pressable
            className="p-[4px] bg-[#F2F2F2] rounded-[8px] flex-row items-center gap-[8.5px] mt-[8px]"
            onPress={onAddToCart}
            disabled={isOpen === false}
          >
            <Text className="text-[12px] leading-[16px] text-[#424242] font-urbanist">
              Sizes
            </Text>
            <DropDownArrow />
          </Pressable>
        </View>
      </View>
      <Text className="text-[12px] leading-[16px] font-urbanist-semibold text-[#2D2220] my-[4px]">
        {distance} km
      </Text>
      {/* Add to cart */}
      <View className="pt-[12px]">
        <IconButton
          label="Add to cart"
          icon={<Carticon />}
          onPress={onAddToCart}
          disabled={isOpen === false}
        />
      </View>
    </View>
  );
}

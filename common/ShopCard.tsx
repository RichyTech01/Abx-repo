import React from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import LoveLogo from "@/assets/svgs/LoveLogo.svg";
import LoveIcon from "@/assets/svgs/LoveIcon.svg";
import MaincartIcon from "@/assets/svgs/MaincartIcon";
import StarRating from "./StarRating";
import { useRouter } from "expo-router";
import { isStoreOpen } from "@/utils/storeStatus";
import * as Haptics from "expo-haptics";

export interface Shop {
  id: string;
  name: string;
  image: string;
  distance?: string;
  rating?: number;
  category?: string;
  isFavorite?: boolean;
  store_open?: string;
  store_close?: string;
  status?: string;
}

interface ShopCardProps {
  shop: Shop;
  width?: number;
  onFavoritePress: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  width,
  onFavoritePress,
}) => {
  const router = useRouter();
  const openStatus = isStoreOpen(shop.store_open, shop.store_close);

  return (
    <TouchableOpacity
      className="bg-white shadow rounded-[8px] shadow-[#624C3917]/10 p-[10px]"
      style={{ width: width || "100%" }}
      // onPress={() => router.push(`/Screens/ShopDetails?id=${shop.id}`)}
    >
      <View className="relative h-[158px]">
        <Image
          source={{ uri: shop.image }}
          className="w-full h-full rounded-[8px]"
        />
        <View
          className={`absolute top-[23px] left-[13px] px-2 py-[3px] rounded-[4px] ${
            openStatus ? "bg-[#05A85A]" : "bg-[#F04438]"
          }`}
        >
          <Text className="text-white text-xs font-urbanist">
            {openStatus ? "Open" : "Closed"}
          </Text>
        </View>

        <Pressable
          className="absolute top-[18px] right-3 w-8 h-8 bg-[#F6F6F6] rounded-full items-center justify-center"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onFavoritePress?.();
          }}
        >
          {shop.isFavorite ? <LoveLogo /> : <LoveIcon />}
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between mt-[16px]">
        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist text-[#4D4D4D]">
            {shop.name}
          </Text>
          <Text className="text-[12px] leading-[16px] font-urbanist-semibold text-[#2D2220] my-[4px]">
            {shop.distance}
          </Text>
          <StarRating rating={shop.rating ?? 0} />
        </View>

        <Pressable className="bg-[#F2F2F2] h-[32px] w-[32px] rounded-full items-center justify-center">
          <MaincartIcon />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard;

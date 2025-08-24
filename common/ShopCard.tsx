import React from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import LoveLogo from "@/assets/svgs/LoveLogo.svg";
import MaincartIcon from "@/assets/svgs/MaincartIcon";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "./StarRating";
import { useRouter } from "expo-router";


export interface Shop {
  id: string;
  name: string;
  image: string;
  status?: string;
  distance?: string;
  rating?: number; 
  category?: string;
}

interface ShopCardProps {
  shop: Shop;
  onPress?: (shop: Shop) => void;
  onCartPress?: (shop: Shop) => void;
  onFavoritePress?: (shop: Shop) => void;
  width?: number 
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress, onCartPress, onFavoritePress, width }) => {

  const router = useRouter()

  const renderStars = () => {
    const stars = [];
    const rating = shop.rating ?? 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={12}
          color="#FF8A00"
          style={{ marginRight: 2,}}
        />
      );
    }

    return <View style={{ flexDirection: "row", marginTop: 4 }}>{stars}</View>;
  };

  return (
    <TouchableOpacity
      onPress={() => router.push("/Screens/ShopDetails")}
      className="bg-white shadow rounded-[8px] shadow-[#624C3917]/10 p-[10px] "
      style={{width: width || "100%"}}
    >
      <View className="relative h-[158px]">
        <Image
          source={{ uri: shop.image }}
          className="w-full h-full rounded-[8px]"
        />
        {shop.status && (
          <View
            className={`absolute top-[23px] left-[13px] px-2 py-[3px] rounded-[4px] ${
              shop.status === "Open" ? "bg-[#05A85A]" : "bg-[#F04438]"
            }`}
          >
            <Text className="text-white text-xs font-urbanist">{shop.status}</Text>
          </View>
        )}
        <Pressable
          className="absolute top-[18px] right-3 w-8 h-8 bg-[#F6F6F6] rounded-full items-center justify-center"
          onPress={() => onFavoritePress?.(shop)}
        >
          <LoveLogo />
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between mt-[16px]">
        <View>
          <Text className="text-[14px] leading-[20px] font-urbanist text-[#4D4D4D]">
            {shop.name}
          </Text>
          <Text className="text-[12px] leading-[16px] font-urbanist-semibold text-[#2D2220] my-[4px] ">
            {shop.distance}
          </Text>
         <StarRating rating={shop.rating ?? 0} />
        </View>

        <Pressable
          className="bg-[#F2F2F2] h-[32px] w-[32px] rounded-full items-center justify-center"
          onPress={() => onCartPress?.(shop)}
        >
          <MaincartIcon />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard;

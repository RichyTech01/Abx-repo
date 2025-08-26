import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import { useRouter } from "expo-router";
import ShopCard from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";

export default function AllClosestShops() {
  const router = useRouter();
  const {
    data: shops,
    isLoading,
    isError,
    locationStatus,
    locationError,
  } = useClosestStores();

  let content;
  if (locationStatus === "pending" || isLoading) {
    content = <ActivityIndicator size="large" color="#000" />;
  } else if (locationStatus === "error") {
    content = <Text>{locationError || "Location permission denied."}</Text>;
  } else if (isError) {
    content = (
      <Text className="mx-auto py-8 text-[14px] text-[#F04438] ">
        Failed to fetch nearest stores.
      </Text>
    );
  } else if (!shops || shops.length === 0) {
    content = <Text>No nearby stores found.</Text>;
  } else {
    content = (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          marginHorizontal: 20,
          paddingTop: 15,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {shops.map((shop: any) => (
          <ShopCard
            key={shop.id.toString()}
            shop={{
              id: shop.id.toString(),
              name: shop.business_name,
              image: shop.store_img,
              distance: shop.distance_km ? `${shop.distance_km}Km away` : "N/A",
              rating: shop.rating,
              isFavorite: shop.is_favorited,
              store_open: shop.open_time,
              store_close: shop.close_time,
            }}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <HeaderWithSearchInput label="Closest shops" />
      {content}
    </SafeAreaView>
  );
}

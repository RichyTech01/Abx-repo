import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";

export default function ClosestShops() {
  const router = useRouter();
  const {
    data: shops,
    isLoading,
    isError,
    locationStatus,
    locationError,
  } = useClosestStores();

  
  const handleShopPress = (shop: any) =>
    console.log("Shop pressed:", shop.name);
  const handleCartPress = (shop: any) =>
    console.log("Cart pressed:", shop.name);
  const handleFavoritePress = (shop: any) =>
    console.log("Favorite toggled:", shop.name);

  let content;
  if (locationStatus === "pending" || isLoading) {
    content = (
      <View className="py-8 items-center">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  } else if (locationStatus === "error") {
    content = (
      <Text className="mx-auto py-8 text-red-500">
        {locationError || "Location permission denied."}
      </Text>
    );
  } else if (isError) {
    content = (
      <Text className="mx-auto py-8 text-red-500">
        Failed to fetch nearest stores.
      </Text>
    );
  } else if (!shops || shops.length === 0) {
    content = <Text className="mx-auto py-8">No nearby stores found.</Text>;
  } else {
    content = (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 24,
          paddingVertical: 8,
        }}
      >
        {shops?.map((shop: any) => (
          <ShopCard
            key={shop.id.toString()}
            shop={{
              id: shop.id.toString(),
              name: shop.business_name,
              image: shop.store_img, 
              distance: shop.distance_km ? `${shop.distance_km}Km away` : "N/A",
              rating: shop.rating || 0,
              isFavorite: shop.isFavorite || false,
              category: shop.category || "General",
              store_open: shop.open_time,
              store_close: shop.close_time
            }}
            width={254}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View>
      <SectionHeader
        title="Closest shops"
        onPress={() => router.push("/Screens/AllClosestShops")}
      />
      {content}
    </View>
  );
}

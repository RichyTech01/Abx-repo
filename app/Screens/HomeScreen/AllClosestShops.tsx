import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";

export default function AllClosestShops() {
  const queryClient = useQueryClient();

  const {
    data: shops,
    isLoading,
    isError,
    locationStatus,
    locationError,
  } = useClosestStores();

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string | number) =>
      StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["closestStores"] }),
  });

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <HeaderWithSearchInput label="Closest shops" />

      <View className="flex-1 mt-4">
        {/* Loading state */}
        {(locationStatus === "pending" || isLoading) && (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginTop: 16 }}
          />
        )}

        {/* Error states */}
        {locationStatus === "error" && (
          <Text className="mx-auto py-8 text-red-500">
            {locationError || "Location permission denied."}
          </Text>
        )}
        {isError && (
          <Text className="mx-auto py-8 text-red-500">
            Failed to fetch nearest stores.
          </Text>
        )}

        {/* No data state */}
        {!isLoading && shops?.length === 0 && (
          <Text className="mx-auto py-8 text-[#2D2220]">
            No nearby stores found.
          </Text>
        )}

        {/* Shops list */}
        {shops?.length > 0 && (
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
                  image:
                    shop.store_img ||
                    "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
                  distance: shop.distance_km ? `${shop.distance_km}Km` : "N/A",
                  rating: shop.rating || 0,
                  isFavorite: shop.is_favorited || false,
                  store_open: shop.open_time,
                  store_close: shop.close_time,
                }}
                onFavoritePress={() => favoriteMutation.mutate(shop.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

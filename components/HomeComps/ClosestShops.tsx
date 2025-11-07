import { View, FlatList, Text, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import LogoutModal from "@/Modals/LogoutModal";
import Storage from "@/utils/Storage";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";

type Props = {
  refreshTrigger: boolean;
};

export default function ClosestShops({ refreshTrigger }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loginVisible, setLoginVisible] = useState(false);
  const shimmerAnim = useShimmerAnimation();

  const {
    data: shops,
    isLoading,
    isError,
    refetch,
    locationStatus,
    locationError,
  } = useClosestStores();

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["closestStores"] }),
  });

  useEffect(() => {
    if (locationStatus === "success") {
      refetch();
    }
  }, [refreshTrigger]);

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => (
        <SkeletonCard shimmerAnim={shimmerAnim} style={{ width: 254 }} />
      )}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 24,
        paddingVertical: 8,
      }}
    />
  );

  const renderItem = ({ item }: { item: any }) => (
    <ShopCard
      shop={{
        id: item.id.toString(),
        name: item.business_name,
        image:
          item.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        distance: item.distance_km
          ? `${parseFloat(item.distance_km).toFixed(1)}`
          : "N/A",
        rating: item.rating || 0,
        isFavorite: item.is_favorited ?? false,
        category: item.category || "General",
        store_open: item.open_time,
        store_close: item.close_time,
      }}
      width={254}
      onFavoritePress={async () => {
        const token = await Storage.get("accessToken");
        if (!token) {
          setLoginVisible(true);
          return;
        }
        favoriteMutation.mutate(item.id);
      }}
    />
  );

  const ListEmptyComponent = () => (
    <Text className="mx-auto py-8">No nearby stores found.</Text>
  );

  const ErrorComponent = ({ message }: { message: string }) => (
    <Text className="mx-auto py-8 text-red-500">{message}</Text>
  );

  let content;
  if (locationStatus === "pending" || isLoading) {
    content = renderSkeletons();
  } else if (locationStatus === "error") {
    content = (
      <ErrorComponent
        message={locationError || "Location permission denied."}
      />
    );
  } else if (isError) {
    content = <ErrorComponent message="Failed to fetch nearest stores." />;
  } else {
    content = (
      <FlatList
        data={shops || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 24,
          paddingVertical: 8,
        }}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  }

  return (
    <View>
      <SectionHeader
        title="Closest shops"
        onPress={() => router.push("/Screens/HomeScreen/AllClosestShops")}
      />
      {content}

      <LogoutModal
        title="Login Required"
        message="Sorry! you need to go back to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["isGuest", ]);
          router.replace("/Login");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />
    </View>
  );
}

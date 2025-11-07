import { View, FlatList, Text, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";
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
  const [loginVisible, setLoginVisible] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const shimmerAnim = useShimmerAnimation();

  const {
    data: queryShops,
    isLoading,
    isError,
    refetch,
    locationStatus,
    locationError,
  } = useClosestStores();

  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["closestStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  // Sync local state with query data and limit to 8 shops
  useEffect(() => {
    if (queryShops && queryShops.length > 0) {
      const mappedShops: Shop[] = queryShops.slice(0, 8).map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        distance: store.distance_km
          ? `${parseFloat(store.distance_km).toFixed(1)}`
          : "N/A",
        rating: store.rating || 0,
        isFavorite: store.is_favorited ?? false,
        category: store.category || "General",
        store_open: store.open_time,
        store_close: store.close_time,
      }));
      setShops(mappedShops);
    } else if (!isLoading && queryShops?.length === 0) {
      setShops([]);
    }
  }, [queryShops, isLoading]);

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

  const renderItem = ({ item }: { item: Shop }) => (
    <ShopCard
      shop={item}
      width={254}
      onFavoritePress={() => handleFavoritePress(item.id)}
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
        data={shops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
        message="Sorry! you need to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.remove("isGuest");
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
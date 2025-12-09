import { View, FlatList, Text } from "react-native";
import { useState } from "react";
import StoreApi from "@/api/StoreApi";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useLocationStore } from "@/store/locationStore";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useQuery } from "@tanstack/react-query";
import OreAppText from "@/common/OreApptext";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";

type Props = {
  refreshTrigger: boolean;
};

export default function TopratedShops({ refreshTrigger }: Props) {
  const router = useRouter();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
  } = useLocationStore();
  const shimmerAnim = useShimmerAnimation();

  const [loginVisible, setLoginVisible] = useState(false);

  // Determine coordinates to use
  const lat = hasPermission === true && latitude != null ? latitude : null;
  const lng = hasPermission === true && longitude != null ? longitude : null;

  const queryKey = [
    "topRatedStores",
    lat?.toString() ?? "null",
    lng?.toString() ?? "null",
  ];

  // React Query for fetching top rated stores
  const {
    data: shops = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await StoreApi.getTopRatedStores(
        lat as number,
        lng as number,
        1
      );

      const newShops: Shop[] = (res.results || [])
        .slice(0, 8)
        .map((store: any) => ({
          id: store.id.toString(),
          name: store.business_name,
          image:
            store.store_img ||
            "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
          store_open: store.open_time,
          store_close: store.close_time,
          isFavorite: store.is_favorited ?? false,
          distance: store.distance_km
            ? `${parseFloat(store.distance_km).toFixed(1)}`
            : "N/A",
        }));

      return newShops;
    },
    enabled: !locationLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  React.useEffect(() => {
    if (refreshTrigger && error) {
      refetch();
    }
  }, [refreshTrigger, error, refetch]);

  const { handleFavoritePress } = useFavoriteShop({
    queryKey: [
      "topRatedStores",
      lat?.toString() ?? "null",
      lng?.toString() ?? "null",
    ],
    onLoginRequired: () => setLoginVisible(true),
  });

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(i) => i.toString()}
      renderItem={() => (
        <SkeletonCard shimmerAnim={shimmerAnim} style={{ width: 254 }} />
      )}
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

  const EmptyMessage = () => (
    <Text
      style={{
        textAlign: "center",
        maxWidth: "60%",
      }}
      className="font-orelega py-10 text-black text-[16px] mx-auto "
    >
      No Top rated shops available at the moment.
    </Text>
  );

  return (
    <View>
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <View className="mx-auto py-6">
          <OreAppText className="text-[16px] text-red-500 ">
            Fetch Error
          </OreAppText>
        </View>
      ) : (
        <FlatList
          data={shops}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          ListEmptyComponent={<EmptyMessage />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
        />
      )}

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

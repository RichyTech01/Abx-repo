import { View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import OreAppText from "@/common/OreApptext";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useLocationStore } from "@/store/locationStore";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";

type Props = {
  refreshTrigger: boolean;
};

export default function TopratedShops({ refreshTrigger }: Props) {
  const { latitude, longitude } = useLocationStore();

  const router = useRouter();
  const [loginVisible, setLoginVisible] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const shimmerAnim = useShimmerAnimation();
  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["topRatedStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const {
    data: queryShops = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<Shop[]>({
    queryKey: ["topRatedStores", latitude, longitude],
    queryFn: async () => {
      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }
      const res = await StoreApi.getTopRatedStores(latitude, longitude);
      return res.results.map((store: any) => ({
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
    },
    enabled: latitude != null && longitude != null,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Sync local state with query data
  useEffect(() => {
    if (queryShops.length > 0) {
      setShops(queryShops);
    } else if (!isLoading && !isFetching && queryShops.length === 0) {
      // Only clear shops if we've finished loading and there's truly no data
      setShops([]);
    }
  }, [queryShops, isLoading, isFetching]);

  useEffect(() => {
    if (latitude && longitude) {
      refetch();
    }
  }, [refreshTrigger, latitude, longitude]);

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

  const ListEmptyComponent = () => {
    if (isLoading || isFetching) {
      return null;
    }

    if (isError) {
      return (
        <OreAppText
          style={{
            textAlign: "center",
            color: "#F04438",
            fontSize: 14,
          }}
          className="justify-center items-center p-3 mx-auto text-center"
        >
          Failed to load top rated stores. Please try again.
        </OreAppText>
      );
    }

    // Show empty state only if we have location and still no data
    if (latitude != null && longitude != null) {
      return (
        <OreAppText
          style={{
            textAlign: "center",
            color: "#535353",
            fontSize: 14,
          }}
          className="justify-center items-center p-3 mx-auto text-center"
        >
          No top rated stores available at the moment.
        </OreAppText>
      );
    }

    return null;
  };

  // Show skeletons only on initial load
  const shouldShowSkeletons =
    (isLoading || isFetching) &&
    shops.length === 0 &&
    latitude != null &&
    longitude != null;

  return (
    <View className="">
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {shouldShowSkeletons ? (
        renderSkeletons()
      ) : (
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

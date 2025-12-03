import { View, Platform, FlatList, RefreshControl } from "react-native";
import { useState, useRef, useMemo } from "react";
import React from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import ScreenWrapper from "@/common/ScreenWrapper";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/store/locationStore";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import NoData from "@/common/NoData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OreAppText from "@/common/OreApptext";

export default function AllTopRatedStores() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
  } = useLocationStore();
  const shimmerAnim = useShimmerAnimation();

  const [loginVisible, setLoginVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Track last refresh time
  const lastRefreshTime = useRef<number>(0);
  const REFRESH_COOLDOWN = 30000;

  // Determine coordinates to use
  const lat = hasPermission === true && latitude != null ? latitude : null;
  const lng = hasPermission === true && longitude != null ? longitude : null;

  // Fetch data for each page
  const {
    data,
    isLoading: loading,
    isFetching,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: [
      "ALl-topRatedStores",
      lat?.toString() ?? "null",
      lng?.toString() ?? "null",
      page,
    ],
    queryFn: async () => {
      const res = await StoreApi.getTopRatedStores(
        lat as number,
        lng as number,
        page
      );

      const shops: Shop[] = (res.results || []).map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        store_open: store.open_time,
        store_close: store.close_time,
        isFavorite: store.is_favorited ?? false,
        rating: store.store_rating,
        distance: store.distance_km
          ? `${parseFloat(store.distance_km).toFixed(1)}`
          : "N/A",
      }));

      return {
        shops,
        hasNext: res.next !== null,
      };
    },
    enabled: !locationLoading && hasMore,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
  });

  // Aggregate all pages from cache
  const allShops = useMemo(() => {
    const shops: Shop[] = [];
    let currentPage = 1;

    while (currentPage <= page) {
      const pageData = queryClient.getQueryData([
        "ALl-topRatedStores",
        lat?.toString() ?? "null",
        lng?.toString() ?? "null",
        currentPage,
      ]) as { shops: Shop[]; hasNext: boolean } | undefined;

      if (pageData?.shops) {
        shops.push(...pageData.shops);
      }
      currentPage++;
    }

    return shops;
  }, [page, lat, lng, queryClient, data]); // Re-compute when data changes

  // Update hasMore when data changes
  React.useEffect(() => {
    if (data) {
      setHasMore(data.hasNext);
    }
  }, [data]);

  React.useEffect(() => {
    if (!isFetching) {
      setIsRefreshing(false);
    }
  }, [isFetching]);

  const { handleFavoritePress } = useFavoriteShop({
    queryKey: [
      "ALl-topRatedStores",
      lat?.toString() ?? "null",
      lng?.toString() ?? "null",
    ],
    onLoginRequired: () => setLoginVisible(true),
  });

  const handleRefresh = async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime.current;

    const dataAge = now - dataUpdatedAt;
    const isFresh = dataAge < 1000 * 60 * 5;

    if (timeSinceLastRefresh < REFRESH_COOLDOWN || isFresh) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
      return;
    }

    setIsRefreshing(true);
    lastRefreshTime.current = now;
    setPage(1);
    setHasMore(true);

    await queryClient.invalidateQueries({
      queryKey: [
        "ALl-topRatedStores",
        lat?.toString() ?? "null",
        lng?.toString() ?? "null",
      ],
    });
  };

  // LOAD MORE
  const handleLoadMore = () => {
    if (hasMore && !isFetching && !isRefreshing) {
      setPage((prev) => prev + 1);
    }
  };

  const renderSkeletons = () => (
    <View style={{ marginHorizontal: 20, paddingTop: 15, gap: 24 }}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} shimmerAnim={shimmerAnim} />
      ))}
    </View>
  );

  const EmptyState = () => (
    <View className="py-20 items-center ">
      <NoData
        title="Empty data"
        subtitle="No top rated product at the moment"
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="pb-[15px]">
        <HeaderWithSearchInput label="Top rated stores" />
      </View>

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <View className="mx-auto py-6">
          <OreAppText className="text-[20px] text-red-500 ">
            Fetch Error
          </OreAppText>
        </View>
      ) : (
        <FlatList
          data={allShops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShopCard
              shop={item}
              onFavoritePress={() => handleFavoritePress(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 20 : 40,
            marginHorizontal: 20,
            paddingTop: 15,
            gap: 24,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && page > 1 && !isRefreshing ? (
              <View className="py-6 items-center">
                <LoadingSpinner />
              </View>
            ) : null
          }
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#0C513F"]}
            />
          }
        />
      )}

      <LogoutModal
        title="Login Required"
        message="Sorry! you need to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["accessToken", "isGuest"]);
          router.replace("/Login");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />
    </ScreenWrapper>
  );
}

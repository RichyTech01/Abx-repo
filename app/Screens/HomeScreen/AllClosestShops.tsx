import { View, FlatList, Platform, RefreshControl } from "react-native";
import React, { useState } from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import ScreenWrapper from "@/common/ScreenWrapper";
import NoData from "@/common/NoData";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/store/locationStore";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import OreAppText from "@/common/OreApptext";

export default function AllClosestShops() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationIsLoading,
  } = useLocationStore();

  const shimmerAnim = useShimmerAnimation();
  const [loginVisible, setLoginVisible] = useState(false);

  const canFetch =
    !locationIsLoading &&
    hasPermission === true &&
    latitude != null &&
    longitude != null;

  // Use InfiniteQuery for pagination
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["AllClosestStores", latitude, longitude],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await StoreApi.getNearestStores(
        latitude!,
        longitude!,
        pageParam
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
          ? `${parseFloat(store.distance_km).toFixed(1)} km`
          : "N/A",
      }));

      return {
        shops,
        hasNext: res.next !== null && res.next !== "" && res.next !== undefined,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNext) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: canFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Flatten all pages into a single array
  const allShops = data?.pages.flatMap((page) => page.shops) || [];

  // Favorite mutation with optimistic updates
  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onMutate: async (storeId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["AllClosestStores", latitude, longitude],
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([
        "AllClosestStores",
        latitude,
        longitude,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["AllClosestStores", latitude, longitude],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              shops: page.shops.map((shop: Shop) =>
                shop.id === storeId
                  ? { ...shop, isFavorite: !shop.isFavorite }
                  : shop
              ),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (error, storeId, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["AllClosestStores", latitude, longitude],
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] });
      queryClient.invalidateQueries({ queryKey: ["AlltopRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["ALl-topRatedStores"] });
    },
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      setLoginVisible(true);
      return;
    }
    favoriteMutation.mutate(storeId);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isRefetching) {
      fetchNextPage();
    }
  };

  const renderSkeletons = () => (
    <View style={{ marginHorizontal: 20, paddingTop: 15, gap: 24 }}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} shimmerAnim={shimmerAnim} />
      ))}
    </View>
  );

  const ListEmptyComponent = () => {
    // Show loading skeletons only on initial load
    if (isLoading && allShops.length === 0 && canFetch) {
      return null;
    }

    // Location is being fetched
    if (locationIsLoading) {
      return (
        <View className="py-20 px-6">
          <OreAppText
            style={{ textAlign: "center", color: "#888", fontSize: 16 }}
          >
            Getting your location...
          </OreAppText>
        </View>
      );
    }

    // Location permission denied
    if (hasPermission === false) {
      return (
        <View className="py-20 px-6">
          <OreAppText
            style={{
              textAlign: "center",
              color: "#F04438",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Location Access Required
          </OreAppText>
          <OreAppText
            style={{
              textAlign: "center",
              color: "#535353",
              fontSize: 14,
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            Please enable location services in your device settings to see
            nearby stores.
          </OreAppText>
          <OreAppText
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: 13,
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            Settings →{" "}
            {Platform.OS === "ios" ? "Privacy → Location Services" : "Location"}
          </OreAppText>
        </View>
      );
    }

    // Location not available yet
    if (!latitude || !longitude) {
      return (
        <View className="py-20 px-6">
          <OreAppText
            style={{ textAlign: "center", color: "#888", fontSize: 16 }}
          >
            Waiting for your location...
          </OreAppText>
          <OreAppText
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: 13,
              marginTop: 8,
            }}
          >
            Make sure location services are enabled in your device settings
          </OreAppText>
        </View>
      );
    }

    // No stores found after successful fetch
    if (allShops.length === 0 && !isLoading) {
      return <NoData title="Empty Data" subtitle="" />;
    }

    return null;
  };

  return (
    <ScreenWrapper>
      <View className="pb-[15px]">
        <HeaderWithSearchInput label="Closest shops" />
      </View>

      {isLoading && allShops.length === 0 && canFetch ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={allShops}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
            isFetchingNextPage ? (
              <View className="py-6 items-center">
                <LoadingSpinner />
              </View>
            ) : null
          }
          ListEmptyComponent={<ListEmptyComponent />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={["#0C513F"]}
              tintColor="#0C513F"
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
          await Storage.remove("isGuest");
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

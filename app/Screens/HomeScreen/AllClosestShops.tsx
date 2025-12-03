import { View, FlatList, Platform, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [page, setPage] = useState(1);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canFetch =
    !locationIsLoading &&
    hasPermission === true &&
    latitude != null &&
    longitude != null;

  const queryKey = ["AllClosestStores", latitude, longitude, page];

  // Use React Query with staleTime to prevent too many requests
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!canFetch) return null;

      const res = await StoreApi.getNearestStores(latitude!, longitude!, page);
      return res;
    },
    enabled: canFetch && hasMore,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Transform and accumulate shops data
  useEffect(() => {
    if (data?.results) {
      const newShops: Shop[] = data.results.map((store: any) => ({
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

      setAllShops((prev) => {
        if (page === 1) {
          // Reset on page 1
          return newShops;
        }
        // Append new shops, filter duplicates by ID
        const existingIds = new Set(prev.map((shop) => shop.id));
        const uniqueNewShops = newShops.filter(
          (shop) => !existingIds.has(shop.id)
        );
        return [...prev, ...uniqueNewShops];
      });

      // Check if there's more data
      setHasMore(
        data.next !== null && data.next !== "" && data.next !== undefined
      );
    }
  }, [data, page]);

  // Favorite mutation with optimistic updates
  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onMutate: async (storeId: string) => {
      // Optimistically update local state
      setAllShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
        )
      );
    },
    onError: (error, storeId) => {
      // Revert on error
      setAllShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
        )
      );
    },
    onSettled: () => {
      // Invalidate queries to sync
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] });
      queryClient.invalidateQueries({ queryKey: ["AlltopRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["AllClosestStores"] });
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
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setAllShops([]);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading && canFetch) {
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
            isLoading && allShops.length > 0 && hasMore ? (
              <View className="py-6 items-center">
                <LoadingSpinner />
              </View>
            ) : null
          }
          ListEmptyComponent={<ListEmptyComponent />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
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

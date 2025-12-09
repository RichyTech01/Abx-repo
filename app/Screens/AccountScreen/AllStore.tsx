import { View, Platform, FlatList, RefreshControl } from "react-native";
import { useState } from "react";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useLocationStore } from "@/store/locationStore";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import OreAppText from "@/common/OreApptext";

export default function AllStore() {
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
    queryKey: ["allStores", latitude, longitude],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await StoreApi.getAllStores(latitude!, longitude!, pageParam);

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

      // Determine if there's a next page
      let hasNext = false;
      if (res.pagination) {
        hasNext = res.pagination.hasNextPage;
      } else if (
        res.next !== null &&
        res.next !== "" &&
        res.next !== undefined
      ) {
        hasNext = true;
      } else {
        // Fallback: assume more data if we got a full page
        hasNext = shops.length >= 12;
      }

      return {
        shops,
        hasNext,
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
        queryKey: ["allStores", latitude, longitude],
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([
        "allStores",
        latitude,
        longitude,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["allStores", latitude, longitude],
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
          ["allStores", latitude, longitude],
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] });
      queryClient.invalidateQueries({ queryKey: ["ALl-topRatedStores"] });
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
    await refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isRefetching) {
      fetchNextPage();
    }
  };

  const renderSkeletons = () => (
    <View
      style={{
        paddingBottom: Platform.OS === "ios" ? 20 : 40,
        marginHorizontal: 20,
        paddingTop: 15,
        gap: 24,
      }}
    >
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
            stores.
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
      return (
        <View className="py-10">
          <NoData title="No data" subtitle="No shop available at the moment." />
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper>
      <View>
        <HeaderWithSearchInput label="All available stores on ABX" />
      </View>

      {isLoading && allShops.length === 0 && canFetch ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={allShops}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 20 : 40,
            marginHorizontal: 20,
            paddingTop: 15,
            gap: 24,
          }}
          keyExtractor={(shop, index) => `store-${shop.id}-${index}`}
          renderItem={({ item: shop }) => (
            <ShopCard
              shop={shop}
              onFavoritePress={() => handleFavoritePress(shop.id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4 items-center">
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
        message="You need to log in to favorite a shop."
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

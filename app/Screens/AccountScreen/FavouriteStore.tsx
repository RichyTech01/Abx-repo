import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Animated,
} from "react-native";
import { useState, useCallback } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useRouter } from "expo-router";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import { useNavigation } from "@react-navigation/native";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useLocationStore } from "@/store/locationStore";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export default function FavouriteStore() {
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
  } = useLocationStore();
  const router = useRouter();
  const navigation = useNavigation();
  const shimmerAnim = useShimmerAnimation();
  const queryClient = useQueryClient();

  const lat = hasPermission === true && latitude != null ? latitude : null;
  const lng = hasPermission === true && longitude != null ? longitude : null;

  const queryKey = [
    "favoriteStores",
    lat?.toString() ?? "null",
    lng?.toString() ?? "null",
  ];

  // Use InfiniteQuery for proper pagination
  const {
    data,
    isLoading: loading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await StoreApi.getFavoriteStores(
        lat as number,
        lng as number,
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
          ? `${parseFloat(store.distance_km).toFixed(1)}`
          : "N/A",
      }));

      return {
        shops,
        hasNext: res.pagination?.hasNextPage ?? shops.length >= 12,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNext) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !locationLoading,
    staleTime: 1000 * 60 * 5,
  });

  // Flatten all pages
  const allShops = data?.pages.flatMap((page) => page.shops) || [];

  // Custom handler for unfavoriting (removes from list)
  const handleFavoritePress = async (storeId: string) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey });

    // Snapshot previous data
    const previousData = queryClient.getQueryData(queryKey);

    // Optimistically remove the shop from ALL pages
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          shops: page.shops.filter((shop: Shop) => shop.id !== storeId),
        })),
      };
    });

    try {
      // Make the API call
      await StoreApi.toggleFavorite(Number(storeId));

      // Invalidate other queries to sync
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["ALl-topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["AllClosestStores"] });
      queryClient.invalidateQueries({ queryKey: ["allStores"] });
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(queryKey, previousData);
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isRefetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isRefetching, fetchNextPage]);

  const SkeletonCard = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={{
          opacity,
          width: "100%",
          height: 180,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 120,
            backgroundColor: "#C4D1DA",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              width: "70%",
              height: 16,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: "50%",
              height: 12,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
            }}
          />
        </View>
      </Animated.View>
    );
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
      {[1, 2, 3, 4].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </View>
  );

  return (
    <ScreenWrapper>
      <View>
        <HeaderWithSearchInput label="Your favorite stores" />
      </View>

      {loading ? (
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
          keyExtractor={(shop, index) => `${shop.id}-${index}`}
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
          ListEmptyComponent={
            <NoData
              title="No favorite stores"
              subtitle="Looks like you don't have any favorite stores yet—no worries, Start browsing and find a store you'll love. We've got plenty of great stores waiting for you!"
              buttonTitle="Explore ABX stores"
              onButtonPress={() => {
                navigation.goBack();
                router.push("/Screens/AccountScreen/AllStore");
              }}
            />
          }
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
    </ScreenWrapper>
  );
}

import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Animated,
} from "react-native";
import { useState, useCallback, useMemo, useEffect } from "react";
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
import { useFavoriteShop } from "@/hooks/useFavoriteShop";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function FavouriteStore() {
  const { latitude, longitude, hasPermission, isLoading: locationLoading } = useLocationStore();
  const router = useRouter();
  const navigation = useNavigation();
  const shimmerAnim = useShimmerAnimation();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Determine coordinates to use
  const lat = hasPermission === true && latitude != null ? latitude : null;
  const lng = hasPermission === true && longitude != null ? longitude : null;

  // Fetch favorite stores with React Query
  const {
    data,
    isLoading: loading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "favoriteStores",
      lat?.toString() ?? "null",
      lng?.toString() ?? "null",
      page,
    ],
    queryFn: async () => {
      const res = await StoreApi.getFavoriteStores(
        lat as number,
        lng as number,
        page
      );

      const shops: Shop[] = res.results.map((store: any) => ({
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
    enabled: !locationLoading && hasMore,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
  });

  // Aggregate all pages from cache
  const allShops = useMemo(() => {
    const shops: Shop[] = [];
    let currentPage = 1;

    while (currentPage <= page) {
      const pageData = queryClient.getQueryData([
        "favoriteStores",
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
  }, [page, lat, lng, queryClient, data]);

  // Update hasMore when data changes
  useEffect(() => {
    if (data) {
      setHasMore(data.hasNext);
    }
  }, [data]);

  useEffect(() => {
    if (!isFetching) {
      setIsRefreshing(false);
    }
  }, [isFetching]);

  const { handleFavoritePress: hookHandleFavoritePress } = useFavoriteShop({
    queryKey: [
      "favoriteStores",
      lat?.toString() ?? "null",
      lng?.toString() ?? "null",
    ],
    onLoginRequired: () => {}, // Already logged in on this screen
  });

  const handleFavoritePress = async (storeId: string) => {
    // Optimistically remove from list (it's being unfavorited)
    queryClient.setQueriesData(
      { queryKey: ["favoriteStores"], exact: false },
      (oldData: any) => {
        if (!oldData) return oldData;

        if (oldData.shops && Array.isArray(oldData.shops)) {
          return {
            ...oldData,
            shops: oldData.shops.filter((shop: Shop) => shop.id !== storeId),
          };
        }

        return oldData;
      }
    );

    await hookHandleFavoritePress(storeId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);

    await queryClient.invalidateQueries({
      queryKey: [
        "favoriteStores",
        lat?.toString() ?? "null",
        lng?.toString() ?? "null",
      ],
    });
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching && !isRefreshing) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching, isRefreshing]);

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
          keyExtractor={(shop) => shop.id}
          renderItem={({ item: shop }) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onFavoritePress={() => handleFavoritePress(shop.id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && page > 1 && !isRefreshing ? (
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
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#0C513F"]}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}
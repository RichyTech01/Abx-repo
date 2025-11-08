import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Animated,
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
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

export default function FavouriteStore() {
  const { latitude, longitude, hasPermission } = useLocationStore();

  const router = useRouter();
  const navigation = useNavigation();
  const shimmerAnim = useShimmerAnimation();
  const hasFetchedRef = useRef(false);

  const [shops, setShops] = useState<Shop[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleFavoritePress: hookHandleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["favoriteStores"],
  });

  const handleFavoritePress = async (storeId: string) => {
    const prevShops = shops;
    setShops((prev) => prev.filter((shop) => shop.id !== storeId));

    await hookHandleFavoritePress(storeId);
  };

  const fetchStores = async (
    pageNum: number,
    append = false,
    isRefreshing = false
  ) => {
    if ((loading && !append && !isRefreshing) || loadingMore) return;

    if (!isRefreshing) {
      append ? setLoadingMore(true) : setLoading(true);
    }

    try {
      // Send location if available, otherwise null
      const lat = hasPermission === true && latitude != null ? latitude : null;
      const lng = hasPermission === true && longitude != null ? longitude : null;

      const res = await StoreApi.getFavoriteStores(
        lat as any,
        lng as any,
        pageNum
      );
      const newShops: Shop[] = res.results.map((store: any) => ({
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

      setShops((prev) => (append ? [...prev, ...newShops] : newShops));

      if (res.pagination) {
        setHasMore(res.pagination.hasNextPage);
      } else {
        if (newShops.length < 12) setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      if (!append) setShops([]);
    } finally {
      if (!isRefreshing) {
        append ? setLoadingMore(false) : setLoading(false);
      }
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStores(1, false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchStores(1, false, true);
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStores(nextPage, true);
    }
  }, [page, hasMore, loadingMore, loading]);

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

      {loading && shops.length === 0 ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={shops}
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
            loadingMore && hasMore ? (
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
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={["#0C513F"]}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}
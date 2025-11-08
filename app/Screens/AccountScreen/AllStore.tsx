import { View, Platform, FlatList, RefreshControl } from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function AllStore() {
  const router = useRouter();
  const { latitude, longitude, hasPermission } = useLocationStore();
  const shimmerAnim = useShimmerAnimation();
  const hasFetchedRef = useRef(false);

  const queryClient = useQueryClient();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      const lng =
        hasPermission === true && longitude != null ? longitude : null;

      const res = await StoreApi.getAllStores(lat as any, lng as any, pageNum);
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

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allStores"] }),
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      setLoginVisible(true);
      return;
    }

    // Optimistic UI update
    const prevShops = shops;
    setShops((prevShops) =>
      prevShops.map((shop) =>
        shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
      )
    );

    // Call API
    favoriteMutation.mutate(storeId, {
      onError: () => {
        // Rollback on error
        setShops(prevShops);
      },
    });
  };

  const HandleRefresh = async () => {
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
        <SkeletonCard key={item} shimmerAnim={shimmerAnim} />
      ))}
    </View>
  );

  return (
    <ScreenWrapper>
      <View>
        <HeaderWithSearchInput label="All available stores on ABX" />
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
            loadingMore && hasMore ? (
              <View className="py-4 items-center">
                <LoadingSpinner />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="py-10">
              <NoData
                title="No data"
                subtitle="No shop available at the moment."
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={HandleRefresh}
              colors={["#0C513F"]}
            />
          }
        />
      )}

      <LogoutModal
        title="Login Required"
        message="You need to go back log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["isGuest", "cartId"]);
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

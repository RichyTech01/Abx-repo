import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Animated,
} from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import ScreenWrapper from "@/common/ScreenWrapper";
import NoData from "@/common/NoData";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/store/locationStore";

export default function AllClosestShops() {
  const { latitude, longitude } = useLocationStore();

  const queryClient = useQueryClient();
  const router = useRouter();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchStores = async (
    pageNum: number,
    append = false,
    isRefreshing = false
  ) => {
    if (loading || loadingMore) return;

    if (!isRefreshing) {
      append ? setLoadingMore(true) : setLoading(true);
    }

    try {
      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }
      const res = await StoreApi.getNearestStores(latitude, longitude, pageNum);
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

      setHasMore(res.next !== null);
    } catch (err) {
      console.error("Error fetching closest stores:", err);
    } finally {
      if (!isRefreshing) {
        append ? setLoadingMore(false) : setLoading(false);
      }
    }
  };

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["closestStores"] }),
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      setLoginVisible(true);
      return;
    }

    favoriteMutation.mutate(storeId, {
      onSuccess: () => {
        setShops((prevShops) =>
          prevShops.map((shop) =>
            shop.id === storeId
              ? { ...shop, isFavorite: !shop.isFavorite }
              : shop
          )
        );
      },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchStores(1, false, true);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStores(1, false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStores(nextPage, true);
    }
  }, [page, hasMore, loadingMore]);

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
      }}
    >
      {[1, 2, 3, 4].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="pb-[15px]">
        <HeaderWithSearchInput label="Closest shops" />
      </View>

      {loading ? (
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
          onEndReachedThreshold={0}
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
                title="No nearby stores"
                subtitle="No closest stores available at the moment."
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <LogoutModal
        title="Login Required"
        message="Sorry! you need to go back to log in to favorite a shop."
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

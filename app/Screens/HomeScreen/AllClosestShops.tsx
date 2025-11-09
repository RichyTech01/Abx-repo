// AllClosestShops.tsx
import { View, FlatList, Platform, RefreshControl } from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import OreAppText from "@/common/OreApptext";

export default function AllClosestShops() {
  const router = useRouter();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationIsLoading,
  } = useLocationStore();

  const shimmerAnim = useShimmerAnimation();
  const hasFetchedRef = useRef(false);

  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["AllClosestStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const canFetch =
    !locationIsLoading &&
    hasPermission === true &&
    latitude != null &&
    longitude != null;

  const fetchStores = async (pageNum: number = 1, append = false) => {
    if (!canFetch) return;

    if (!append) setLoading(true);
    if (append) setLoadingMore(true);

    try {
      const res = await StoreApi.getNearestStores(
        latitude!,
        longitude!,
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

      // Check for both null and empty string
      setHasMore(
        res.next !== null && res.next !== "" && res.next !== undefined
      );

      if (append) {
        setPage(pageNum);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      if (!append) setShops([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current && canFetch) {
      hasFetchedRef.current = true;
      fetchStores(1);
    }
  }, [canFetch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchStores(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchStores(page + 1, true);
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
    if (loading && canFetch) return null;

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
            Location access not permitted
          </OreAppText>
          <OreAppText
            style={{
              textAlign: "center",
              color: "#535353",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            Enable location in settings to see nearby stores
          </OreAppText>
        </View>
      );
    }

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
            Make sure location services are enabled
          </OreAppText>
        </View>
      );
    }

    return (
      <View className="py-20 px-6">
        <OreAppText
          style={{ textAlign: "center", color: "#535353", fontSize: 16 }}
        >
          No nearby stores found
        </OreAppText>
        <OreAppText
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Try moving to a different area
        </OreAppText>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View className="pb-[15px]">
        <HeaderWithSearchInput label="Closest shops" />
      </View>

      {loading && shops.length === 0 && canFetch ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={shops}
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
            loadingMore && hasMore ? (
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

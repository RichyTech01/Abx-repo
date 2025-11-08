// AllTopRatedStores.tsx
import { View, Platform, FlatList, RefreshControl } from "react-native";
import { useState, useEffect, useRef } from "react";
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

export default function AllTopRatedStores() {
  const router = useRouter();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
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
    queryKey: ["AlltopRatedStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const fetchStores = async (pageNum: number = 1, append = false) => {
    console.log(
      "FETCHING TOP RATED STORES... page:",
      pageNum,
      "append:",
      append
    );

    if (!append) setLoading(true);
    if (append) setLoadingMore(true);

    try {
      // Only send coordinates if we have explicit permission AND valid coordinates
      const lat = hasPermission === true && latitude != null ? latitude : null;
      const lng =
        hasPermission === true && longitude != null ? longitude : null;

      console.log(
        "Sending lat/lng:",
        lat,
        lng,
        "hasPermission:",
        hasPermission
      );

      const res = await StoreApi.getTopRatedStores(
        lat as number,
        lng as number,
        pageNum
      );

      console.log("API SUCCESS:", res.results?.length, "stores");

      const newShops: Shop[] = (res.results || []).map((store: any) => ({
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

      setShops((prev) => (append ? [...prev, ...newShops] : newShops));
      setHasMore(res.next !== null);
      setPage(pageNum);
    } catch (err: any) {
      console.error("FETCH FAILED:", err);
      console.error("Response:", err.response?.data);
      if (!append) setShops([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch immediately on mount - don't wait for anything
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStores(1);
    }
  }, []);

  // REFRESH
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStores(1);
    setRefreshing(false);
  };

  // LOAD MORE
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

  const EmptyState = () => (
    <View className="py-20 items-center px-6">
      <OreAppText
        style={{ fontSize: 16, color: "#535353", textAlign: "center" }}
      >
        No top rated stores available right now.
      </OreAppText>
      <OreAppText
        style={{
          fontSize: 14,
          color: "#888",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        Pull down to try again.
      </OreAppText>
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="pb-[15px]">
        <HeaderWithSearchInput label="Top rated stores" />
      </View>

      {loading && shops.length === 0 ? (
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
            loadingMore ? (
              <View className="py-6 items-center">
                <LoadingSpinner />
              </View>
            ) : null
          }
          ListEmptyComponent={<EmptyState />}
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

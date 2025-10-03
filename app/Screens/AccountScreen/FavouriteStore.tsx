import { View, ActivityIndicator, FlatList, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useRouter } from "expo-router";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import { useNavigation } from "@react-navigation/native";
import Storage from "@/utils/Storage";
import { LoadingSpinner } from "@/common/LoadingSpinner";

export default function FavouriteStore() {
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await Storage.get("accessToken");
      const guest = await Storage.get("isGuest");

      if (token && !guest) {
        setIsGuest(false);
      } else {
        setIsGuest(true);
      }
    };

    checkLogin();
  }, []);

  const fetchStores = async (pageNum: number, append = false) => {
    if (loading || loadingMore) return;

    append ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await StoreApi.getFavoriteStores(pageNum);
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
        distance: store.distance_km || "N/A",
      }));

      setShops((prev) => (append ? [...prev, ...newShops] : newShops));

      if (res.pagination) {
        setHasMore(res.pagination.hasNextPage);
      } else {
        if (newShops.length < 12) setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] }),
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      setLoginVisible(true);
      return;
    }

    // Optimistic remove
    const prevShops = shops;
    setShops((prev) => prev.filter((shop) => shop.id !== storeId));

    // Call API
    favoriteMutation.mutate(storeId, {
      onError: () => {
        // Rollback if API fails
        setShops(prevShops);
      },
    });
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

  return (
    <ScreenWrapper>
      <View>
        <HeaderWithSearchInput label="Your favorite stores" />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ paddingVertical: 20 }}
        />
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
          onEndReachedThreshold={0}
          ListFooterComponent={
            <View className="py-4 items-center">
              <LoadingSpinner />
            </View>
          }
          ListEmptyComponent={
            <NoData
              title="No favorite stores"
              subtitle="Looks like you don't have any favorite stores yet—no worries, Start browsing and find a store you'll love. We've got plenty of great stores waiting for you! "
              buttonTitle="Explore ABX stores"
              onButtonPress={() => {
                navigation.goBack();
                router.push("/Screens/AccountScreen/AllStore");
              }}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

import { View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import StoreApi from "@/api/StoreApi";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import OreAppText from "@/common/OreApptext";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useLocationStore } from "@/store/locationStore";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";

type Props = {
  refreshTrigger: boolean;
};

export default function TopratedShops({ refreshTrigger }: Props) {
  const { latitude, longitude } = useLocationStore();
  const router = useRouter();
  const shimmerAnim = useShimmerAnimation();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["topRatedStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const fetchStores = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }
      const res = await StoreApi.getTopRatedStores(latitude, longitude, 1);
      const newShops: Shop[] = res.results.slice(0, 8).map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        store_open: store.open_time,
        store_close: store.close_time,
        isFavorite: store.is_favorited ?? false,
        distance: store.distance_km
          ? `${parseFloat(store.distance_km).toFixed(1)}`
          : "N/A",
      }));

      setShops(newShops);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchStores();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (refreshTrigger && latitude && longitude) {
      fetchStores();
    }
  }, [refreshTrigger]);

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => (
        <SkeletonCard shimmerAnim={shimmerAnim} style={{ width: 254 }} />
      )}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 24,
        paddingVertical: 8,
      }}
    />
  );

  const renderItem = ({ item }: { item: Shop }) => (
    <ShopCard
      shop={item}
      width={254}
      onFavoritePress={() => handleFavoritePress(item.id)}
    />
  );

  const ListEmptyComponent = () => {
    if (loading) {
      return null;
    }

    if (latitude != null && longitude != null) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            minHeight: 100,
          }}
        >
          <OreAppText
            style={{
              textAlign: "center",
              color: "#535353",
              fontSize: 14,
            }}
          >
            No top rated stores available at the moment.
          </OreAppText>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="">
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {loading && shops.length === 0 ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={shops}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
          ListEmptyComponent={ListEmptyComponent}
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
    </View>
  );
}

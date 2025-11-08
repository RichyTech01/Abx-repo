// TopratedShops.tsx
import { View, FlatList } from "react-native";
import { useState, useEffect, useRef } from "react";
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
  const router = useRouter();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
  } = useLocationStore();
  const shimmerAnim = useShimmerAnimation();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Track if we've successfully fetched data
  const hasFetchedRef = useRef(false);
  // Track the last location we fetched with
  const lastFetchedLocation = useRef<{
    lat: number | null;
    lng: number | null;
  } | null>(null);

  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["topRatedStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const fetchStores = async () => {
    setLoading(true);

    try {
      let lat: number | null = null;
      let lng: number | null = null;

      // ONLY USE LOCATION IF WE HAVE PERMISSION + COORDINATES
      if (hasPermission === true && latitude && longitude) {
        lat = latitude;
        lng = longitude;
      }
      // OTHERWISE: send null,null → backend handles it perfectly

      const res = await StoreApi.getTopRatedStores(
        lat as number,
        lng as number,
        1
      );

      const newShops: Shop[] = (res.results || [])
        .slice(0, 8)
        .map((store: any) => ({
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
      hasFetchedRef.current = true;
      lastFetchedLocation.current = { lat, lng };
    } catch (err) {
      console.error("Top rated fetch error:", err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;

    if (locationLoading) return;

    if (hasPermission && latitude && longitude) {
      fetchStores(); 
    } else if (hasPermission === false) {
      fetchStores(); // without location
    }
  }, [locationLoading, hasPermission, latitude, longitude]);

  // Parent refresh (pull-to-refresh) - force refetch
  useEffect(() => {
    if (refreshTrigger) {
      hasFetchedRef.current = false; // Reset the flag to allow refetch
      fetchStores();
    }
  }, [refreshTrigger]);

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(i) => i.toString()}
      renderItem={() => (
        <SkeletonCard shimmerAnim={shimmerAnim} style={{ width: 254 }} />
      )}
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

  const EmptyMessage = () => (
    <View
      style={{
        paddingHorizontal: 20,
        minHeight: 100,
        justifyContent: "center",
      }}
    >
      <OreAppText
        style={{ textAlign: "center", color: "#535353", fontSize: 14 }}
      >
        No top rated stores available at the moment.
      </OreAppText>
    </View>
  );

  return (
    <View>
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {loading ? (
        renderSkeletons()
      ) : shops.length === 0 ? (
        <EmptyMessage />
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

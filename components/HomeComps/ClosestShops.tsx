import { View, FlatList, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import LogoutModal from "@/Modals/LogoutModal";
import Storage from "@/utils/Storage";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import { useFavoriteShop } from "@/hooks/useFavoriteShop";
import { useLocationStore } from "@/store/locationStore";
import OreAppText from "@/common/OreApptext";

type Props = { refreshTrigger: boolean };

export default function ClosestShops({ refreshTrigger }: Props) {
  const router = useRouter();
  const {
    latitude,
    longitude,
    hasPermission,
    isLoading: locationLoading,
  } = useLocationStore();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginVisible, setLoginVisible] = useState(false);
  const shimmerAnim = useShimmerAnimation();

  // Track if we've successfully fetched data
  const hasFetchedRef = useRef(false);
  // Track the last location we fetched with
  const lastFetchedLocation = useRef<{ lat: number; lng: number } | null>(null);

  const { handleFavoritePress } = useFavoriteShop({
    shops,
    setShops,
    queryKey: ["closestStores"],
    onLoginRequired: () => setLoginVisible(true),
  });

  const fetchStores = async () => {
    // Need actual coordinates for closest shops
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await StoreApi.getNearestStores(latitude, longitude, 1);
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
      hasFetchedRef.current = true;
      lastFetchedLocation.current = { lat: latitude, lng: longitude };
    } catch (err) {
      console.error(err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch - only when location is ready and hasn't been fetched
  useEffect(() => {
    // Skip if already fetched
    if (hasFetchedRef.current) {
      setLoading(false);
      return;
    }

    // Wait for location to initialize
    if (locationLoading) return;

    // Permission denied - can't show closest shops
    if (hasPermission === false) {
      setLoading(false);
      return;
    }

    // No coordinates yet
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }

    // Check if location changed significantly (more than ~100m)
    if (lastFetchedLocation.current) {
      const { lat: lastLat, lng: lastLng } = lastFetchedLocation.current;
      const latDiff = Math.abs(latitude - lastLat);
      const lngDiff = Math.abs(longitude - lastLng);

      // If location hasn't changed significantly, skip fetch
      if (latDiff < 0.001 && lngDiff < 0.001) {
        setLoading(false);
        return;
      }
    }

    fetchStores();
  }, [locationLoading, hasPermission, latitude, longitude]);

  // Refresh trigger - force refetch
  useEffect(() => {
    if (refreshTrigger && latitude && longitude) {
      hasFetchedRef.current = false; // Reset flag to allow refetch
      fetchStores();
    }
  }, [refreshTrigger, latitude, longitude]);

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

  const LocationPermissionDenied = () => (
    <View className="px-[20px] py-[16px] min-h-[120px] justify-center">
      <OreAppText
        style={{
          textAlign: "center",
          color: "#F04438",
          fontSize: 15,
          fontWeight: "500",
        }}
      >
        Location access not permitted
      </OreAppText>
      <OreAppText
        style={{
          textAlign: "center",
          color: "#535353",
          fontSize: 13,
          marginTop: 8,
        }}
      >
        Enable location to see stores near you
      </OreAppText>
    </View>
  );

  const renderContent = () => {
    // Permission denied
    if (!locationLoading && hasPermission === false) {
      return <LocationPermissionDenied />;
    }

    // Loading
    if (loading) {
      return renderSkeletons();
    }

    // No location yet
    if (!latitude || !longitude) {
      return (
        <View
          style={{
            paddingHorizontal: 20,
            minHeight: 120,
            justifyContent: "center",
          }}
        >
          <OreAppText
            style={{ textAlign: "center", color: "#888", fontSize: 14 }}
          >
            Waiting for your location...
          </OreAppText>
        </View>
      );
    }

    // No shops found
    if (shops.length === 0) {
      return (
        <Text
          style={{
            textAlign: "center",
            maxWidth: "60%",
          }}
          className="font-orelega py-10 text-black text-[16px] mx-auto "
        >
          No closest shops available at the moment.
        </Text>
      );
    }

    // Show shops
    return (
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
    );
  };

  return (
    <View>
      <SectionHeader
        title="Closest shops"
        onPress={() => router.push("/Screens/HomeScreen/AllClosestShops")}
      />
      {renderContent()}
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

import { View, FlatList, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

type Props = {
  refreshTrigger: boolean;
};

export default function TopratedShops({ refreshTrigger }: Props) {
  const { latitude, longitude } = useLocationStore();

  const router = useRouter();
  const [loginVisible, setLoginVisible] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const queryClient = useQueryClient();

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

  const {
    data: shops = [],
    isLoading,
    refetch,
  } = useQuery<Shop[]>({
    queryKey: ["topRatedStores", latitude, longitude],
    queryFn: async () => {
      // This check is redundant now since enabled will prevent the query
      // But keeping it as a safety check
      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }
      const res = await StoreApi.getTopRatedStores(latitude, longitude);
      return res.results.map((store: any) => ({
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
    },
    enabled: latitude != null && longitude != null,
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (latitude && longitude) {
      refetch();
    }
  }, [refreshTrigger]);

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] }),
  });

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => <SkeletonCard shimmerAnim={shimmerAnim} style={{width:254}}/>}
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
      onFavoritePress={async () => {
        const token = await Storage.get("accessToken");
        if (!token) {
          setLoginVisible(true);
          return;
        }
        favoriteMutation.mutate(item.id);
      }}
    />
  );

  const ListEmptyComponent = () => (
    <OreAppText
      style={{
        textAlign: "center",
        color: "red",
        fontSize: 14,
      }}
      className="justify-center items-center p-3 mx-auto text-center "
    >
      No top rated stores available at the moment.
    </OreAppText>
  );

  return (
    <View className="">
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {isLoading || (shops.length === 0 && latitude == null) ? (
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
          await Storage.multiRemove(["isGuest", "cartId"]);
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

import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard, { Shop } from "@/common/ShopCard";
import OreAppText from "@/common/OreApptext";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";

export default function TopratedShops() {
  const router = useRouter();
  const [loginVisible, setLoginVisible] = useState(false);

  const queryClient = useQueryClient();

  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ["topRatedStores"],
    queryFn: async () => {
      const res = await StoreApi.getTopRatedStores();
      return res.results.map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        store_open: store.open_time,
        store_close: store.close_time,
        isFavorite: store.is_favorited ?? false,
        distance: store.distance_km ? `${store.distance_km} km` : "N/A",
      }));
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] }),
  });

  return (
    <View className=" ">
      <SectionHeader
        title="Top Rated Shops"
        onPress={() => router.push("/Screens/HomeScreen/AllTopRatedStores")}
      />

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={"black"}
          style={{ marginTop: 16 }}
        />
      ) : shops.length === 0 ? (
        <OreAppText
          style={{
            textAlign: "center",
            marginTop: 16,
            color: "red",
            fontSize: 14,
          }}
        >
          No top rated stores available at the moment.
        </OreAppText>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
        >
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              width={254}
              onFavoritePress={async () => {
                const token = await Storage.get("accessToken");
                if (!token) {
                  setLoginVisible(true);
                  return;
                }
                favoriteMutation.mutate(shop.id);
              }}
            />
          ))}
        </ScrollView>
      )}
      <LogoutModal
        title="Login Required"
        message="Sorry! you need to go back to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["accessToken", "isGuest", "cartId"]);
          router.replace("/onboarding");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />
    </View>
  );
}

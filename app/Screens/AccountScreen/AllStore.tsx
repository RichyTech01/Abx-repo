import { View, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";

export default function AllStore() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loginVisible, setLoginVisible] = useState(false);

  // Fetch all stores
  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ["allStores"],
    queryFn: async () => {
      const res = await StoreApi.getAllStores();
      return res.results.map((store: any) => ({
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
    },
  });

  // Toggle favorite
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
    favoriteMutation.mutate(storeId);
  };

  return (
    <ScreenWrapper>
      <View>
        <HeaderWithSearchInput label="All available stores on ABX" />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#00000"
          style={{ marginTop: 16 }}
        />
      ) : shops.length === 0 ? (
        <View className="py-10  ">
          <NoData
            title="No data "
            subtitle="No shop available at the moment."
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 20 : 40,
            marginHorizontal: 20,
            paddingTop: 15,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onFavoritePress={() => handleFavoritePress(shop.id)}
            />
          ))}
        </ScrollView>
      )}

      <LogoutModal
        title="Login Required"
        message="You need to go back log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={() => router.replace("/Login")}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />
    </ScreenWrapper>
  );
}

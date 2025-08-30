import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";

export default function FavouriteStore() {
  const queryClient = useQueryClient();

  // Fetch favorite stores
  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ["favoriteStores"],
    queryFn: async () => {
      const res = await StoreApi.getFavoriteStores(); 
      return res.results.map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        store_open: store.open_time,
        store_close: store.close_time,
        isFavorite: store.is_favorited ?? true, 
      }));
    },
  });

  // Toggle favorite
  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] }),
  });

  return (
    <ScreenWrapper>
      <View
        className={`${Platform.OS === "android" ? "mt-[45px]" : ""} pb-[15px]`}
      >
        <HeaderWithSearchInput label="Favourite Stores" />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 16 }}
        />
      ) : shops.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginTop: 16,
            color: "#666",
            fontSize: 14,
          }}
        >
          You have no favorite stores yet.
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
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
              onFavoritePress={() => favoriteMutation.mutate(shop.id)}
            />
          ))}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

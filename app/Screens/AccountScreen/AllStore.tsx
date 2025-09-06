import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";

export default function AllStore() {
  const queryClient = useQueryClient();

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
        distance: store.distance_km || "N/A"
      }));
    },
  });

  // Toggle favorite
  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allStores"] }),
  });

  return (
    <ScreenWrapper>
      <View
      >
        <HeaderWithSearchInput label="All available stores on ABX" />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#00000"
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
          No stores available at the moment.
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

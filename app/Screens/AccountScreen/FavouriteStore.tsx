import {
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useRouter } from "expo-router";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import { useNavigation } from "@react-navigation/native";

export default function FavouriteStore() {
  const router = useRouter();
  const navigation =useNavigation()
  const queryClient = useQueryClient();

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

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] }),
  });

  return (
    <ScreenWrapper>
      <View
        >
        <HeaderWithSearchInput label="Your favorite stores" />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ paddingVertical: 20 }}
        />
      ) : shops.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <NoData
            title="No favorite stores"
            subtitle="Looks like you don't have any favorite stores yet—no worries, Start browsing and find a store you'll love. We've got plenty of great stores waiting for you! "
            buttonTitle="Explore ABX stores"
            onButtonPress={() => {navigation.goBack(); router.push("/Screens/AccountScreen/AllStore")}}
          />
        </ScrollView>
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

import {
  View,
  Text,
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
import EmptyyImg from "@/assets/svgs/EmptyStoreImg.svg";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";

export default function FavouriteStore() {
  const router = useRouter();
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
        className={`${Platform.OS === "android" ? "mt-[45px]" : ""} pb-[15px]`}
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
          <View className="bg-white rounded-[8px] mx-[20px] py-[50px] px-[32px]  items-center ">
            <View className="items-center">
              <EmptyyImg />
              <OreAppText className="text-[#121212] text-[16px] leading-[20px] mt-[18px] ">
                No favorite stores
              </OreAppText>
            </View>
            <UrbanistText className="text-[#2C2C2C] text-[12px] leading-[16px] text-center mt-[16px] ">
              Looks like you don&apos;t have any favorite stores yet—no worries,
              Start browsing and find a store you&apos;ll love. We&apos;ve got
              plenty of great stores waiting for you!
            </UrbanistText>

            <View className="mt-[24px] ">
              <Button
                title="Explore ABX stores"
                onPress={() => router.push("/Screens/AllTopRatedStores")}
              />
            </View>
          </View>
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

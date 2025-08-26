import { useEffect, useState } from "react";
import { View, SafeAreaView, Platform, ScrollView, ActivityIndicator } from "react-native";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from "@/common/ShopCard";
import StoreApi from "@/api/StoreApi"; 
import axios from "axios";

export default function AllTopRatedStores() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await StoreApi.getAllStores(1);
        const mapped = data.results.map((store: any) => {
          const now = new Date();
          const currentHour = now.getHours();
          const openHour = parseInt(store.open_time.split(":")[0], 10);
          const closeHour = parseInt(store.close_time.split(":")[0], 10);
          const isOpen = currentHour >= openHour && currentHour < closeHour;

          return {
            id: store.id.toString(),
            name: store.business_name,
            image: store.store_img || "https://via.placeholder.com/150",
            distance: store.distance_km ? `${store.distance_km} km` : "N/A",
            rating: store.store_rating || 0,
            status: isOpen ? "Open" : "Closed",
            isFavorite: store.is_favorited ?? false,
            category: store.address?.city || "General",
          };
        });

        setShops(mapped);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);



  const handleShopPress = (shop: Shop) => console.log("Shop pressed:", shop.name);
  const handleCartPress = (shop: Shop) => console.log("Cart pressed:", shop.name);
  const handleFavoritePress = (shop: Shop) => console.log("Favorite toggled:", shop.name);

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <View className={`${Platform.OS === "android" ? "mt-[45px]" : ""} pb-[15px]`}>
        <HeaderWithSearchInput label="Top rated stores" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#05A85A" style={{ marginTop: 50 }} />
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
              onPress={handleShopPress}
              onCartPress={handleCartPress}
              onFavoritePress={handleFavoritePress}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

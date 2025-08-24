import { View, SafeAreaView, Platform, ScrollView } from "react-native";
import React from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ShopCard, { Shop } from '@/common/ShopCard';

const sampleShops = [
  {
    id: '1',
    name: "Iya Bukola's shop",
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    distance: '5Km away',
    rating: 4,
    status: "Open",
    isFavorite: false,
    category: 'Spices & Herbs',
  },
  {
    id: '2',
    name: "Mama Kemi's Store",
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    distance: '2.5Km away',
    rating: 4.5,
    status: "Closed",
    isFavorite: true,
    category: 'Fresh Produce',
  },
  {
    id: '3',
    name: "Alhaji's Bulk Shop",
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5bcec?w=400',
    distance: '8Km away',
    rating: 3.5,
    status: 'Closed',
    isFavorite: false,
    category: 'Grains & Cereals',
  },
];



export default function AllClosestShops() {

      const handleShopPress = (shop: Shop) => console.log('Shop pressed:', shop.name);
      const handleCartPress = (shop: Shop) => console.log('Cart pressed:', shop.name);
      const handleFavoritePress = (shop: Shop) => console.log('Favorite toggled:', shop.name);

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <View
        className={`${Platform.OS === "android" ? "mt-[45px] " : ""} pb-[15px] `}
      >
        <HeaderWithSearchInput label="Closest shops" />
      </View>

       <ScrollView
        contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 20, paddingTop: 15, gap:24 }}
        showsVerticalScrollIndicator={false}
      >
        {sampleShops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onPress={handleShopPress}
            onCartPress={handleCartPress}
            onFavoritePress={handleFavoritePress}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

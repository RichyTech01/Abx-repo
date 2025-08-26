import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Platform,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import CategoryProduct from "@/common/CategoryProduct";
import { useLocalSearchParams, useRouter } from "expo-router";
import StoreApi from "@/api/StoreApi";

export default function CategoryDetails() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await StoreApi.getAllProducts({ category, page: 1 });
        setProducts(data.results || []);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    if (category) fetchProducts();
  }, [category]);

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <View className={`${Platform.OS === "android" ? "mt-[40px]" : ""}`}>
        <HeaderWithSearchInput
          label={category || "Category"}
          placeholder="Ask ABX AI or search for food items of your choice"
        />
      </View>

      {/* 🔹 Loading under header */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text>No products found.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: SCREEN_PADDING,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: GAP,
          }}
          renderItem={({ item }) => (
            <View style={{ width: ITEM_WIDTH }}>
              <CategoryProduct
                image={{ uri: item.prod_image_url }}
                name={item.item_name}
                price={`€${item.min_price} - €${item.max_price}`}
                rating={2}
                onPress={() =>
                  router.push({
                    pathname: "/Screens/ProductDetails",
                    params: { product: JSON.stringify(item) },
                  })
                }
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

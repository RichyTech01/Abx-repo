import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import CategoryProduct from "@/common/CategoryProduct";
import { useLocalSearchParams, useRouter } from "expo-router";
import StoreApi from "@/api/StoreApi";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import NoData from "@/common/NoData";
import { ShopProductType } from "@/types/store";
import { useQuery } from "@tanstack/react-query";

export default function CategoryDetails() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();

  // Modal & product details state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["categoryProducts", category],
    queryFn: async () => {
      if (!category) return [];

      let allResults: any[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const data = await StoreApi.getAllProducts({ category, page });
        allResults = [...allResults, ...(data.results || [])];

        // Check if there's another page
        if (data.next) {
          page += 1;
        } else {
          hasNext = false;
        }
      }

      return allResults;
    },
    enabled: !!category, 
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const { data: product, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId && modalVisible,
      staleTime: 5 * 60 * 1000,
    });

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <View className={`${Platform.OS === "android" ? "mt-[40px]" : ""}`}>
        <HeaderWithSearchInput
          label={category || "Category"}
          placeholder="Search for food items of your choice"
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0C513F" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
                rating={0}
                onPress={() =>
                  router.push({
                    pathname: "/Screens/HomeScreen/ProductDetails",
                    params: { id: item.id },
                  })
                }
                onAddToCart={() => handleAddToCart(item.id)}
                isOutOfStock={
                  item.variations?.[0]?.stock === 0 || !item.variations?.length
                }
                isOpen={
                  item.store
                    ? isStoreOpen(item.store.open_time, item.store.close_time)
                    : false
                }
                discountPercent={item.variations?.[0]?.discount_per}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="py-10 mx-auto text-[16px]">
              <NoData
                title="No product available"
                subtitle="No product available now, come back later"
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add to Cart Modal */}
      <AddtoCartModal
        value={modalVisible}
        setValue={setModalVisible}
        loading={productLoading}
        data={product?.variations ?? []}
        isOpen={
          product?.store
            ? isStoreOpen(product.store.open_time, product.store.close_time)
            : false
        }
      />
    </SafeAreaView>
  );
}

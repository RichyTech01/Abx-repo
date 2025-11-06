import {
  View,
  Dimensions,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import SearchInput from "@/common/SearchInput";
import StoreApi from "@/api/StoreApi";
import { ShopProductType } from "@/types/store";
import CategoryProduct from "@/common/CategoryProduct";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import NoData from "@/common/NoData";

// Skeleton Loading Component
const ProductSkeleton = ({ width }: { width: number }) => (
  <View
    style={{ width }}
    className="bg-gray-200 rounded-lg overflow-hidden animate-pulse"
  >
    <View className="h-40 bg-gray-300" />
    <View className="p-3">
      <View className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
      <View className="h-3 bg-gray-300 rounded mb-2 w-1/2" />
      <View className="h-4 bg-gray-300 rounded w-1/3" />
    </View>
  </View>
);

const SCREEN_PADDING = 20;
const GAP = 16;
const ITEM_WIDTH =
  (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

export default function BestSellingProducts() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery<ShopProductType[]>({
    queryKey: ["bestSellingProducts"],
    queryFn: async () => {
      const res = await StoreApi.getPopularProducts();
      return res;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddToCart = async (id: number) => {
    setModalVisible(true);
    setProductLoading(true);
    try {
      const product = await StoreApi.getProduct(id);
      setProductDetails(product);
    } catch (err) {
      console.error("Failed to fetch product details", err);
    } finally {
      setProductLoading(false);
    }
  };

  const products = data ?? [];

  return (
    <ScreenWrapper>
      <Header title="Best Selling Products" />
      <View className="mb-60">
        <View className="mx-[20px] mt-[10px]">
          <SearchInput />
        </View>

        <View>
          {isLoading ? (
            <FlatList
              data={Array(6).fill(0)}
              keyExtractor={(_, index) => `skeleton-${index}`}
              numColumns={2}
              contentContainerStyle={{
                paddingHorizontal: SCREEN_PADDING,
                paddingTop: 16,
              }}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: GAP,
              }}
              renderItem={() => <ProductSkeleton width={ITEM_WIDTH} />}
            />
          ) : products.length === 0 ? (
            <ScrollView contentContainerClassName="py-[10%] h-full">
              <NoData
                title="No Best Selling Products"
                subtitle="Looks like there are no best selling products available at the moment. Please check back later!"
              />
            </ScrollView>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              className="h-screen"
              contentContainerStyle={{
                paddingHorizontal: SCREEN_PADDING,
                paddingTop: 16,
                paddingBottom: 210,
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
                        pathname: "/Screens/HomeScreen/ProductDetails",
                        params: { id: item.id },
                      })
                    }
                    onAddToCart={() => handleAddToCart(item.id)}
                    isOutOfStock={
                      item.variations?.[0]?.stock === 0 ||
                      !item.variations?.length
                    }
                    isOpen={
                      item.store
                        ? isStoreOpen(
                            item.store.open_time,
                            item.store.close_time
                          )
                        : false
                    }
                    discountPercent={
                      Number(item.variations?.[0]?.discount_per) || 0
                    }
                  />
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          )}
        </View>
      </View>

      <AddtoCartModal
        value={modalVisible}
        setValue={setModalVisible}
        loading={productLoading}
        data={productDetails?.variations ?? []}
        isOpen={
          productDetails
            ? isStoreOpen(
                productDetails.store.open_time,
                productDetails.store.close_time
              )
            : false
        }
      />
    </ScreenWrapper>
  );
}
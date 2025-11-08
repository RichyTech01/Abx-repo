import { View, Dimensions, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import SearchInput from "@/common/SearchInput";
import StoreApi from "@/api/StoreApi";
import { ShopProductType } from "@/types/store";
import CategoryProduct from "@/common/CategoryProduct";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import NoData from "@/common/NoData";
import { ProductSkeletonGrid } from "@/common/ProductSkeletonGrid";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { getDistanceInKm } from "@/utils/getDistanceInKm";
import { useLocationStore } from "@/store/locationStore";

const SCREEN_PADDING = 20;
const GAP = 16;
const ITEM_WIDTH =
  (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

export default function AllProductScreen() {
  const router = useRouter();
  const { longitude, latitude } = useLocationStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["allProducts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await StoreApi.getAllProducts({ page: pageParam });
      return res;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.next ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch product details only when needed
  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId && modalVisible,
    });

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const products = data?.pages.flatMap((page) => page.results) ?? [];

  // Calculate distance for a product
  const calculateDistance = (product: any): number => {
    if (
      (!latitude && longitude) ||
      !product.store?.store_address?.location?.coordinates
    ) {
      return 0; // Return 0 if location data is unavailable
    }

    const storeLon = product.store.store_address.location.coordinates[0];
    const storeLat = product.store.store_address.location.coordinates[1];

    return getDistanceInKm(
      latitude as number,
      longitude as number,
      storeLat,
      storeLon
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <LoadingSpinner />
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="All Products" />
      <View className="mb-60">
        <View className="mx-[20px] mt-[10px]">
          <SearchInput />
        </View>

        <View>
          {isLoading ? (
            <ProductSkeletonGrid
              count={6}
              itemWidth={ITEM_WIDTH}
              screenPadding={SCREEN_PADDING}
              gap={GAP}
            />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item, index) => `${item.id}-${index}`}
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
              ListEmptyComponent={
                <NoData
                  title="No Products Available"
                  subtitle="Please check back later!"
                />
              }
              renderItem={({ item }) => {
                const distance = calculateDistance(item);

                return (
                  <View style={{ width: ITEM_WIDTH }}>
                    <CategoryProduct
                      image={{ uri: item.prod_image_url }}
                      name={item.item_name}
                      price={`€${item.min_price} - €${item.max_price}`}
                      rating={item.average_rating}
                      distance={parseFloat(distance.toFixed(1))}
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
                );
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => refetch()}
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

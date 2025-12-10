import { View, Dimensions, FlatList, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import UrbanistText from "@/common/UrbanistText";
import SearchInput from "@/common/SearchInput";
import StoreApi from "@/api/StoreApi";
import { ShopProductType } from "@/types/store";
import CategoryProduct from "@/common/CategoryProduct";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import NoData from "@/common/NoData";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useLocationStore } from "@/store/locationStore";
import { getDistanceInKm } from "@/utils/getDistanceInKm";

export default function RescueAndSave() {
  const router = useRouter();
  const { latitude, longitude } = useLocationStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery<{ results: ShopProductType[] }>(
    {
      queryKey: ["All-rescueAndSaveProducts"],
      staleTime: 7 * 60 * 1000,
      queryFn: async () => {
        let allResults: ShopProductType[] = [];
        let page = 1;
        let next: string | null = null;

        do {
          const res = await StoreApi.getPublishedProducts({
            page,
            published: true,
            discounted_product: true,
          });

          allResults = [...allResults, ...res.results];
          next = res.next || null;
          page++;
        } while (next);

        return { results: allResults };
      },
    }
  );

  // Calculate distance for a product
  const calculateDistance = useCallback(
    (product: ShopProductType): number => {
      if (
        latitude == null ||
        longitude == null ||
        !product.store?.store_address?.location?.coordinates
      ) {
        return 0;
      }

      const storeLon = product.store.store_address.location.coordinates[0];
      const storeLat = product.store.store_address.location.coordinates[1];

      return getDistanceInKm(latitude, longitude, storeLat, storeLon);
    },
    [latitude, longitude]
  );

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

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  const products = data?.results ?? [];

  return (
    <ScreenWrapper>
      <Header title="Rescue and save" />
      <View className="mb-60">
        <UrbanistText className="text-[#2D2220] text-[14px] mt-[7px] leading-[20px] mx-[35px]">
          (These are products that are near their expiration date but still
          edible)
        </UrbanistText>

        <View className="mx-[20px] mt-[16px]">
          <SearchInput />
        </View>

        <View>
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-10">
              <LoadingSpinner />
            </View>
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
              renderItem={({ item }) => {
                const distance = calculateDistance(item);

                return (
                  <View style={{ width: ITEM_WIDTH }}>
                    <CategoryProduct
                      image={{ uri: item.prod_image_url }}
                      name={item.item_name}
                      price={`€${item.min_price} - €${item.max_price}`}
                      store_code={item.store.store_code}
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
              ListEmptyComponent={
                <NoData
                  title="No Discounted Product"
                  subtitle="Looks like you don't have any discounted Product yet. No worries, we've got plenty discounted products waiting for you!"
                />
              }
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

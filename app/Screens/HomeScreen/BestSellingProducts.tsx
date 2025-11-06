import {
  View,
  Dimensions,
  FlatList,
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
import { ProductSkeletonGrid } from "@/common/ProductSkeletonGrid";

const SCREEN_PADDING = 20;
const GAP = 16;
const ITEM_WIDTH =
  (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

export default function BestSellingProducts() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery<ShopProductType[]>({
    queryKey: ["bestSellingProducts"],
    queryFn: async () => {
      const res = await StoreApi.getPopularProducts();
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId && modalVisible,
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const products = data ?? [];

  return (
    <ScreenWrapper>
      <Header title="Best Selling Products" />
      <View className="">
        <View className="mx-[20px] mt-[10px]">
          <SearchInput />
        </View>

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
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: SCREEN_PADDING,
              paddingTop: 16,
              paddingBottom: 210,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: GAP,
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
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
                      ? isStoreOpen(item.store.open_time, item.store.close_time)
                      : false
                  }
                  discountPercent={
                    Number(item.variations?.[0]?.discount_per) || 0
                  }
                />
              </View>
            )}
            ListEmptyComponent={
              <NoData
                title="No Products Available"
                subtitle="Please check back later!"
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

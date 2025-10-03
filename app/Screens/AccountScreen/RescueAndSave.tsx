import {
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
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

export default function RescueAndSave() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  // const [selectedProductId, setSelectedProductId] = React.useState<
  //   number | null
  // >(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);

  const { data, isLoading } = useQuery<{ results: ShopProductType[] }>({
    queryKey: ["rescueAndSaveProducts"],
    queryFn: () =>
      StoreApi.getPublishedProducts({
        page: 1,
        published: true,
        discounted_product: true,
      }),
  });

  const handleAddToCart = async (id: number) => {
    setModalVisible(true);
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
      <View className="mb-60  ">
        <UrbanistText className="text-[#2D2220] text-[14px] mt-[7px] leading-[20px] mx-[35px]  ">
          (These are products that are near their expiration date but still
          edible)
        </UrbanistText>

        <View className="mx-[20px]  mt-[16px]  ">
          <SearchInput />
        </View>

        <View>
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-10  ">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : products?.length === 0 ? (
            <ScrollView contentContainerClassName="py-[10%] h-full  ">
              <NoData
                title="No Discounted Product"
                subtitle="Looks like you dont have any discounted Product yet, no worries, we've got plenty discounted product waiting for you"
              />
            </ScrollView>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              className="h-screen "
              contentContainerStyle={{
                paddingHorizontal: SCREEN_PADDING,
                paddingTop: 16,
                paddingBottom: 80,
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
                    // discountPercent={item?.rescue_n_save}
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

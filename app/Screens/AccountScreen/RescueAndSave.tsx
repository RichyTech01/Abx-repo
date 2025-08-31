import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import UrbanistText from "@/common/UrbanistText";
import SearchInput from "@/common/SearchInput";
import StoreApi from "@/api/StoreApi";
import { Product, ProductVariation } from "@/types/store";
import CategoryProduct from "@/common/CategoryProduct";
import AddtoCartModal from "@/Modals/AddtoCartModal";

export default function RescueAndSave() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);

  const { data, isLoading, error } = useQuery<{ results: Product[] }>({
    queryKey: ["rescueAndSaveProducts"],
    queryFn: () =>
      StoreApi.getPublishedProducts({
        page: 1,
        published: true,
      }),
  });

  const handleAddToCart = async (id: number) => {
    setSelectedProductId(id);
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

        <View className="mx-[20px]  items-center  mt-[16px]  ">
          <SearchInput />
        </View>

        <View>
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : products?.length === 0 ? (
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
                        params: { id: item.id },
                      })
                    }
                    onAddToCart={() => handleAddToCart(item.id)}
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
      />
    </ScreenWrapper>
  );
}

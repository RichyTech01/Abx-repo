import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useState } from "react";
import OreAppText from "@/common/OreApptext";
import CategoryProduct from "@/common/CategoryProduct";
import StoreApi from "@/api/StoreApi";
import { useRouter } from "expo-router";
import { ShopProductType } from "@/types/store";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import { useQuery } from "@tanstack/react-query";

export interface StoreProductProps {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  products: ShopProductType[];
}

export default function AboutStore({ id }: { id: number; image: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const router = useRouter();

  const {
    data: shopProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["storeWithProducts", id],
    queryFn: () => StoreApi.getStoreWithProducts(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
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
      staleTime: 6 * 60 * 1000,
    });

  return (
    <View>
      <OreAppText className="text-[16px] leading-[20px] text-[#2D2220] mx-auto my-[24px]  ">
        Available food items in store
      </OreAppText>

      {isLoading ? (
        <View className="py-10">
          <ActivityIndicator size={"large"} color={"#0C513F"} />
        </View>
      ) : error ? (
        <View className="mx-auto py-6">
          <OreAppText className="text-[20px] text-red-500 ">
            Fetch Error
          </OreAppText>
        </View>
      ) : (
        <View>
          <FlatList
            data={shopProduct?.products ?? []}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }}
            renderItem={({ item }) => (
              <View style={{ width: "48%" }}>
                <CategoryProduct
                  name={item.item_name}
                  price={`€${item.min_price} - €${item.max_price}`}
                  rating={4.5}
                  image={{ uri: item.prod_image_url }}
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
                    item.variations?.[0]?.discount_per
                      ? Number(item.variations[0].discount_per)
                      : 0
                  }
                />
              </View>
            )}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="py-10 mx-auto  ">
                <Text className="text-red-500">No Items available</Text>
              </View>
            }
          />
        </View>
      )}
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
    </View>
  );
}

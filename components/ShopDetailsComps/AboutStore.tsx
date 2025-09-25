import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import OreAppText from "@/common/OreApptext";
import CategoryProduct from "@/common/CategoryProduct";
import StoreApi from "@/api/StoreApi";
import { useRouter } from "expo-router";
import { ShopProductType } from "@/types/store";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";

export interface StoreProductProps {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  products: ShopProductType[];
}

export default function AboutStore({
  id,
}: {
  id: number;
  image: string;
}) {
  const [shopProduct, setShopProduct] = useState<StoreProductProps | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  // const [, setSelectedProductId] = useState<number | null>(
  //   null
  // );
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchpr = async () => {
      setLoading(true);
      try {
        const data = await StoreApi.getStoreWithProducts(id);
        setShopProduct(data);
      } catch (error) {
        console.error("Failed to fetch store:", error);
      }
      setLoading(false);
    };
    fetchpr();
  }, [id]);

  const handleAddToCart = async (id: number) => {
    // setSelectedProductId(id);
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

  return (
    <View>
      <OreAppText className="text-[16px] leading-[20px] text-[#2D2220] mx-auto my-[24px]  ">
        Available food items in store
      </OreAppText>

      {loading ? (
        <View className="py-10">
          <ActivityIndicator size={"large"} color={"black"} />
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
                  sizes={item.variations?.length ?? 0}
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
        data={productDetails?.variations ?? []}
        isOpen={
          productDetails?.store
            ? isStoreOpen(
                productDetails.store.open_time,
                productDetails.store.close_time
              )
            : false
        }
      />
    </View>
  );
}

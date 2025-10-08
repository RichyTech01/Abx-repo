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
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import NoData from "@/common/NoData";

export default function CategoryDetails() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & product details state
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedProductId, setSelectedProductId] = useState<number | null>(
  //   null
  // );
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!category) return;

      setLoading(true);
      try {
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

        setProducts(allResults);
      } catch (err) {
        console.error("Failed to fetch all products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [category]);

  // Handle add to cart modal
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
          <ActivityIndicator size="large" color="#000" />
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
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="py-10 mx-auto text-[16px] ">
              <NoData
                title="No product available"
                subtitle="No product available now, come back later"
              />
            </View>
          }
        />
      )}

      {/* Add to Cart Modal */}
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
    </SafeAreaView>
  );
}

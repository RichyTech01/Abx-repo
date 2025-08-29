import {
  View,
  Text,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import { Product, ProductVariation } from "@/types/store";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import showToast from "@/utils/showToast";

export default function RescueAndSaveProduct() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const { data, isLoading, error } = useQuery<{ results: Product[] }>({
    queryKey: ["rescueAndSaveProducts"],
    queryFn: () =>
      StoreApi.getPublishedProducts({
        page: 1,
        published: true,
      }),
  });

  const { data: productDetails, isLoading: isProductLoading } =
    useQuery<Product>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

  if (error) {
    showToast("error", (error as Error).message || "Failed to load product");
  }
  const products = data?.results ?? [];

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  return (
    <View className={`${Platform.OS === "ios" ? "mb-16" : "mb-20"} mb-16`}>
      <SectionHeader title="Rescue and save" onPress={() => {}} />

      <Text className="mx-[20px] text-[#2D2220] text-[10px] leading-[14px] font-urbanist ">
        (These are products that are near their expiration date but still
        edible)
      </Text>

      {isLoading ? (
        <ActivityIndicator size="small" style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={{ marginTop: 16, color: "red" }}>
          Failed to load rescue and save products
        </Text>
      ) : products.length === 0 ? (
        <Text style={{ marginTop: 16, color: "#666", textAlign: "center" }}>
          No rescue and save products available at the moment.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id.toString()}
              productName={product.item_name}
              priceRange={`€${product.min_price} - €${product.max_price}`}
              isOutOfStock={
                product.variations?.[0]?.stock === 0 ||
                !product.variations?.length
              }
              isShopOpen={true}
              rating={4.9}
              sizes={product.variations?.length ?? 0}
              onAddToCart={() => handleAddToCart(product.id)}
              ProductImg={{ uri: product.prod_image_url }}
              store_open={product.store?.open_time}
              store_close={product.store?.close_time}
            />
          ))}
        </ScrollView>
      )}

      <AddtoCartModal
        value={modalVisible}
        setValue={setModalVisible}
        data={(productDetails?.variations ?? []) as ProductVariation[]}
        loading={isProductLoading}
      />
    </View>
  );
}

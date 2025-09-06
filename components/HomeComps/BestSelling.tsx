import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import { ProductVariation, ShopProductType } from "@/types/store";

export default function BestSelling() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const { data, isLoading, error } = useQuery<{ results: ShopProductType[] }>({
    queryKey: ["bestSellingProducts"],
    queryFn: async () => {
      const res = await StoreApi.getPopularProducts();
      return { results: res };
    },
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

  const products = data?.results ?? [];

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  return (
    <View>
      <SectionHeader title="Best selling products" />

      {isLoading ? (
        <ActivityIndicator size="small" style={{ paddingHorizontal: 16 }} />
      ) : error ? (
        <Text style={{ marginTop: 16, color: "red" }}>
          Failed to load products
        </Text>
      ) : products.length === 0 ? (
        <Text
          style={{ marginVertical: 16, color: "#666", textAlign: "center" }}
        >
          No best-selling products available at the moment.
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
        loading={productLoading}
        data={(productDetails?.variations ?? []) as ProductVariation[]}
        isOpen={
          productDetails
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

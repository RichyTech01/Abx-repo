import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import StoreApi from "@/api/StoreApi";
import { ShopProductType, ProductVariation } from "@/types/store";
import { isStoreOpen } from "@/utils/storeStatus";
import AddtoCartModal from "@/Modals/AddtoCartModal";

export default function NewProducts() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const { data, isLoading, error } = useQuery<{ results: ShopProductType[] }>({
    queryKey: ["newProducts"],
    queryFn: () => StoreApi.getPublishedProducts(),
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

  const products = data?.results.slice(0, 8) ?? [];

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  return (
    <View>
      <SectionHeader title="New products" onPress={() => {}} />

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={"black"}
          style={{ marginTop: 16 }}
        />
      ) : error ? (
        <Text style={{ marginTop: 16, color: "red" }}>
          Failed to load new products
        </Text>
      ) : products.length === 0 ? (
        <Text className="items-center justify-center" style={{ marginTop: 16, color: "#666", textAlign: "center" }}>
          No new products available at the moment.
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
              saleText="Sale 50%"
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

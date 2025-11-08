import {
  View,
  Text,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import { ShopProductType, ProductVariation } from "@/types/store";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import showToast from "@/utils/showToast";
import { isStoreOpen } from "@/utils/storeStatus";
import { useLocationStore } from "@/store/locationStore";
import { getDistanceInKm } from "@/utils/getDistanceInKm";

type Props = {
  refreshTrigger: boolean;
};

export default function RescueAndSaveProduct({ refreshTrigger }: Props) {
  const router = useRouter();
  const { latitude, longitude } = useLocationStore();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const { data, isLoading, error, refetch } = useQuery<{
    results: ShopProductType[];
  }>({
    queryKey: ["rescueAndSaveProducts"],
    queryFn: () =>
      StoreApi.getPublishedProducts({
        page: 1,
        published: true,
        discounted_product: true,
      }),
  });

  const { data: productDetails, isLoading: isProductLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

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

  if (error) {
    showToast("error", (error as Error).message || "Failed to load product");
  }

  const products = (data?.results ?? []).slice(0, 4);

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  useEffect(() => {
    refetch();
  }, [refreshTrigger]);

  return (
    <View className={`${Platform.OS === "ios" ? "mb-16" : "mb-28"} mb-16`}>
      <SectionHeader
        title="Rescue and save"
        onPress={() => router.push("/Screens/AccountScreen/RescueAndSave")}
      />

      <Text className="mx-[20px] text-[#2D2220] text-[10px] leading-[14px] font-urbanist">
        (These are products that are near their expiration date but still
        edible)
      </Text>

      {isLoading ? (
        <ActivityIndicator size="small" style={{ marginTop: 16 }} />
      ) : error ? (
        <Text
          style={{ marginTop: 16, color: "red" }}
          className="items-center justify-center mx-auto"
        >
          Failed to load rescue and save products
        </Text>
      ) : products.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            maxWidth: "60%",
          }}
          className="font-orelega py-10 text-black text-[16px] mx-auto "
        >
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
          {products.map((product) => {
            const firstVariation = product.variations?.[0];
            const distance = calculateDistance(product);

            return (
              <ProductCard
                key={product.id}
                productId={product.id.toString()}
                productName={product.item_name}
                priceRange={`€${product.min_price} - €${product.max_price}`}
                isOutOfStock={
                  firstVariation?.stock === 0 || !product.variations?.length
                }
                isShopOpen={true}
                rating={4.9}
                distance={parseFloat(distance.toFixed(1))}
                onAddToCart={() => handleAddToCart(product.id)}
                ProductImg={{ uri: product.prod_image_url }}
                store_open={product.store?.open_time}
                store_close={product.store?.close_time}
                discountPercent={firstVariation?.discount_per}
              />
            );
          })}
        </ScrollView>
      )}

      <AddtoCartModal
        value={modalVisible}
        setValue={setModalVisible}
        data={(productDetails?.variations ?? []) as ProductVariation[]}
        loading={isProductLoading}
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

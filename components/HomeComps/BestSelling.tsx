import { View, FlatList, Text, Animated } from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import { ProductVariation, ShopProductType } from "@/types/store";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/store/locationStore";
import { getDistanceInKm } from "@/utils/getDistanceInKm";
import OreAppText from "@/common/OreApptext";

type Props = {
  refreshTrigger: boolean;
};

export default function BestSelling({ refreshTrigger }: Props) {
  const { longitude, latitude } = useLocationStore();

  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const { data, isLoading, error } = useQuery<ShopProductType[]>({
    queryKey: ["bestSellingProducts", "home"],
    queryFn: async () => {
      const res = await StoreApi.getPopularProducts();
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

  const products = data?.slice(0, 10) ?? [];

  const handleAddToCart = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  // Calculate distance for a product
  const calculateDistance = useCallback(
    (product: ShopProductType): number => {
      if (
        (!longitude && !latitude) ||
        !product.store?.store_address?.location?.coordinates
      ) {
        return 0;
      }

      const storeLon = product.store.store_address.location.coordinates[0];
      const storeLat = product.store.store_address.location.coordinates[1];

      return getDistanceInKm(
        latitude as number,
        longitude as number,
        storeLat,
        storeLon
      );
    },
    [latitude, longitude]
  );

  // useEffect(() => {
  //   if (refreshTrigger) {
  //     refetch();
  //   }
  // }, []);

  const SkeletonCard = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={{
          opacity,
          width: 160,
          height: 220,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 140,
            backgroundColor: "#C4D1DA",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              width: "80%",
              height: 14,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: "60%",
              height: 12,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: "40%",
              height: 16,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
            }}
          />
        </View>
      </Animated.View>
    );
  };

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3, 4]}
      renderItem={() => <SkeletonCard />}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 24,
        paddingVertical: 8,
      }}
    />
  );

  const renderItem = ({ item }: { item: ShopProductType }) => {
    const discountPercent = item.variations?.length
      ? Math.max(...item.variations.map((v) => Number(v.discount_per ?? 0)))
      : null;

    const distance = calculateDistance(item);

    return (
      <ProductCard
        productId={item.id.toString()}
        productName={item.item_name}
        priceRange={`€${item.min_price} - €${item.max_price}`}
        isShopOpen={true}
        store_code={item.store.store_code}
        distance={parseFloat(distance.toFixed(1))}
        onAddToCart={() => handleAddToCart(item.id)}
        ProductImg={{ uri: item.prod_image_url }}
        store_open={item.store?.open_time}
        store_close={item.store?.close_time}
        discountPercent={
          discountPercent && discountPercent > 0
            ? discountPercent.toString()
            : null
        }
      />
    );
  };

  const ListEmptyComponent = () => (
    <Text
      style={{
        textAlign: "center",
        maxWidth: "60%",
      }}
      className="font-orelega py-10 text-black text-[16px] mx-auto "
    >
      No best selling products available at the moment.
    </Text>
  );

  const ErrorComponent = () => (
    <View className="mx-auto py-6">
      <OreAppText className="text-[16px] text-red-500 ">Fetch Error</OreAppText>
    </View>
  );

  return (
    <View>
      <SectionHeader
        title="Best selling products"
        onPress={() => router.push("/Screens/HomeScreen/BestSellingProducts")}
      />

      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        <ErrorComponent />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
          ListEmptyComponent={ListEmptyComponent}
          removeClippedSubviews
        />
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

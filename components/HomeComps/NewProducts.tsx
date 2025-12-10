import React, { useEffect, useRef, useCallback, memo, useState } from "react";
import { View, FlatList, Text, Animated } from "react-native";
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

const NewProducts = ({ refreshTrigger }: Props) => {
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
  }, [shimmerAnim]);

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["newProducts"],
    queryFn: async () => {
      const res = await StoreApi.getAllProducts({ page: 1 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId && modalVisible,
      staleTime: 5 * 60 * 1000,
    });

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
    [longitude, latitude]
  );

  // Extract products and limit to 8
  const products = data?.results?.slice(0, 8) ?? [];

  const handleAddToCart = useCallback((id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  }, []);

  // useEffect(() => {
  //   if (refreshTrigger) refetch();
  // }, [refreshTrigger, refetch]);

  // Memoized shimmer skeleton
  const SkeletonCard = memo(() => {
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
          {[80, 60, 40].map((width, i) => (
            <View
              key={i}
              style={{
                width: `${width}%`,
                height: i === 2 ? 16 : 12,
                backgroundColor: "#C4D1DA",
                borderRadius: 4,
                marginBottom: i < 2 ? 6 : 0,
              }}
            />
          ))}
        </View>
      </Animated.View>
    );
  });

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

  const renderItem = useCallback(
    ({ item }: { item: ShopProductType }) => {
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
          distance={parseFloat(distance.toFixed(1))}
          store_code={item.store.store_code}
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
    },
    [handleAddToCart, calculateDistance]
  );

  const ListEmptyComponent = memo(() => (
    <Text
      style={{
        textAlign: "center",
        maxWidth: "60%",
      }}
      className="font-orelega py-10 text-black text-[16px] mx-auto "
    >
      No new products available at the moment.
    </Text>
  ));

  const ErrorComponent = memo(() => (
    <View className="mx-auto py-6">
      <OreAppText className="text-[16px] text-red-500 ">Fetch Error</OreAppText>
    </View>
  ));

  return (
    <View>
      <SectionHeader
        title="New products"
        onPress={() => router.push("/Screens/HomeScreen/AllProductScreen")}
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
          removeClippedSubviews
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
          ListEmptyComponent={ListEmptyComponent}
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
};

export default memo(NewProducts);

import React, { useEffect, useRef, useCallback, memo } from "react";
import { View, FlatList, Text, Animated } from "react-native";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";
import { useQuery } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { isStoreOpen } from "@/utils/storeStatus";
import { ProductVariation, ShopProductType } from "@/types/store";
import { useRouter } from "expo-router";

type Props = {
  refreshTrigger: boolean;
};

const BestSelling = ({ refreshTrigger }: Props) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Shimmer animation
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

  // Fetch products
  const { data, isLoading, error, refetch } = useQuery<ShopProductType[]>({
    queryKey: ["bestSellingProducts", "home"],
    queryFn: async () => await StoreApi.getPopularProducts(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: productDetails, isLoading: productLoading } =
    useQuery<ShopProductType>({
      queryKey: ["productDetails", selectedProductId],
      queryFn: () => StoreApi.getProduct(selectedProductId as number),
      enabled: !!selectedProductId,
    });

  // Slice for preview performance
  const products = data?.slice(0, 10) ?? [];

  const handleAddToCart = useCallback((id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  }, []);

  // Refetch on refreshTrigger change
  useEffect(() => {
    if (refreshTrigger) refetch();
  }, [refreshTrigger, refetch]);

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

  // Memoized renderItem
  const renderItem = useCallback(
    ({ item }: { item: ShopProductType }) => {
      const discountPercent = item.variations?.length
        ? Math.max(...item.variations.map((v) => Number(v.discount_per ?? 0)))
        : null;

      return (
        <ProductCard
          productId={item.id.toString()}
          productName={item.item_name}
          priceRange={`€${item.min_price} - €${item.max_price}`}
          isShopOpen={true}
          rating={4.9}
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
    [handleAddToCart]
  );

  const ListEmptyComponent = memo(() => (
    <Text
      style={{ marginVertical: 16, color: "#666", textAlign: "center" }}
      className="items-center justify-center mx-auto"
    >
      No best-selling products available at the moment.
    </Text>
  ));

  const ErrorComponent = memo(() => (
    <Text
      style={{ marginTop: 16, color: "red" }}
      className="items-center justify-center mx-auto"
    >
      Failed to load products
    </Text>
  ));

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
          removeClippedSubviews
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 24,
            paddingVertical: 8,
          }}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
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

export default memo(BestSelling);

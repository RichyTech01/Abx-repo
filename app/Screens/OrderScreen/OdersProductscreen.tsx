import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import OrderApi from "@/api/OrderApi";
import Button from "@/common/Button";
import { useRouter } from "expo-router";

const ProductSkeleton = () => {
  return (
    <View className="bg-white mb-[24px] overflow-hidden">
      <View className="flex-row items-center p-[12px]">
        {/* Image Skeleton */}
        <View className="h-[94px] w-[120px] bg-gray-200 rounded-lg animate-pulse" />

        {/* Product Info Skeleton */}
        <View className="ml-[26px] flex-1">
          {/* Title Skeleton */}
          <View className="h-[20px] bg-gray-200 rounded w-[80%] mb-[8px] animate-pulse" />
          <View className="h-[20px] bg-gray-200 rounded w-[60%] mb-[8px] animate-pulse" />

          {/* Price Skeleton */}
          <View className="h-[16px] bg-gray-200 rounded w-[40%] mb-[12px] animate-pulse" />

          {/* Button Skeleton */}
          <View className="h-[36px] bg-gray-200 rounded animate-pulse" />
        </View>
      </View>
    </View>
  );
};

export default function OdersProductscreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrderProducts = async () => {
      try {
        setLoading(true);
        const res = await OrderApi.getCustomerOrderById(orderId);
        setProducts(res?.orderitems || []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch order products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderProducts();
    }
  }, [orderId]);

  const handleReviewProduct = (product: any) => {
    router.push({
      pathname: "/Screens/OrderScreen/WriteOrderProductReview",
      params: {
        productId: product.productId,
        productName: product.item_name,
        productImage: product.item_img,
        productPrice: product.price,
        orderId: orderId,
      },
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Review Orders" />
        <View className="flex-1 mx-[24px] mt-[14px]">
          {/* Header Text */}
          <Text className="text-[14px] font-urbanist-medium text-[#111827] text-center">
            We value your feedback on your recent purchase, it helps us make
            sure you're happy with your experience.
          </Text>

          {/* Skeleton Loaders */}
          <ScrollView
            className="mt-[40px]"
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-white">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <Header title="Review Orders" />
        <View className="flex-1 items-center justify-center px-[24px]">
          <Text className="text-[14px] text-[#DC6C3C] text-center">
            {error}
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={{ marginTop: 20, width: "100%" }}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Review Orders" />
      <View className="flex-1 mx-[24px] mt-[14px]">
        <Text className="text-[14px] font-urbanist-medium text-[#111827] text-center">
          We value your feedback on your recent purchase, it helps us make sure
          you're happy with your experience.
        </Text>

        <ScrollView
          className="mt-[40px]"
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white">
            {products.length === 0 ? (
              <View className="items-center py-[40px]">
                <Text className="text-[14px] text-[#6B7280] text-center">
                  No products found in this order.
                </Text>
              </View>
            ) : (
              products.map((product) => (
                <View
                  key={product.id}
                  className="bg-white mb-[24px] overflow-hidden"
                >
                  <View className="flex-row items-center p-[12px]">
                    {/* Product Image */}
                    <View className="h-[94px] w-[120px]">
                      <Image
                        source={{ uri: product.item_img }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Product Info */}
                    <View className="ml-[26px] flex-1">
                      <Text
                        className="text-[#111827] text-[16px] font-urbanist-semibold"
                        numberOfLines={2}
                      >
                        {product.item_name}
                      </Text>

                      <View className="flex-row items-center mt-[4px]">
                        <Text className="text-[#6B7280] text-[14px] font-urbanist-medium">
                          €{product.price}
                        </Text>
                      </View>

                      {/* Review Button */}
                      <View className="mt-[8px]">
                        <Button
                          title="Write Review"
                          onPress={() => handleReviewProduct(product)}
                          style={{
                            paddingVertical: 6,
                            minHeight: 36,
                          }}
                          textStyle={{ fontSize: 12 }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

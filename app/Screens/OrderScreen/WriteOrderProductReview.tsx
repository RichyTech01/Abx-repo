import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import {
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import OrderApi from "@/api/OrderApi";
import { useRouter } from "expo-router";
import showToast from "@/utils/showToast";

export default function WriteOrderProductReview() {
  const router = useRouter();
  const { productId, productName, productImage, productPrice } =
    useLocalSearchParams<{
      productId: string;
      productName: string;
      productImage: string;
      productPrice: string;
    }>();

  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const [comment, setcomment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

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

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await OrderApi.createProductReview(Number(productId), 0, comment);
      showToast("success", "Review submitted");
      router.back();
    } catch (err: any) {
      let message = "Something went wrong";

      if (
        err?.response?.data?.non_field_errors &&
        Array.isArray(err.response.data.non_field_errors)
      ) {
        message = err.response.data.non_field_errors[0];
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.response?.data?.error) {
        message = err.response.data.error;
      } else if (err?.details?.message) {
        message = err.details.message;
      } else if (err?.message) {
        message = err.message;
      }

      console.error("Failed to submit review:", message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <View className="mx-[24px] mt-[14px]">
      {/* Product Card Skeleton */}
      <View className="mt-[44px] py-[8px] rounded-[8px] bg-white px-[10px]">
        <View className="bg-white overflow-hidden">
          <View className="flex-row items-center p-[12px]">
            <Animated.View
              className="h-[94px] w-[120px] bg-gray-200 rounded-[8px]"
              style={{ opacity: shimmerOpacity }}
            />
            <View className="ml-[26px] flex-1">
              <Animated.View
                className="h-[20px] bg-gray-200 rounded-[4px] mb-[8px]"
                style={{ opacity: shimmerOpacity, width: "80%" }}
              />
              <Animated.View
                className="h-[16px] bg-gray-200 rounded-[4px]"
                style={{ opacity: shimmerOpacity, width: "40%" }}
              />
            </View>
          </View>
        </View>
      </View>

      <Animated.View
        className="mt-[24px] bg-transparent rounded-[12px] border border-[#C4C4C4] p-[13px]"
        style={{ opacity: shimmerOpacity }}
      >
        <View className="h-[20px] bg-gray-200 rounded-[4px] mb-[10px] w-[60%] mx-auto" />
        <View className="bg-gray-100 rounded-[8px] p-[16px] min-h-[160px]" />
      </Animated.View>

      {/* Button Skeleton */}
      <Animated.View
        className="mt-[32px] h-[50px] bg-gray-200 rounded-[8px]"
        style={{ opacity: shimmerOpacity }}
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <Header title="Review Orders" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      >
        <View className="flex-1">
          <View className="mx-[24px] mt-[14px]">
            <Text className="text-[14px] font-urbanist-medium text-[#111827] text-center">
              We value your feedback on your recent purchase, it helps us make
              sure you're happy with your experience.
            </Text>
          </View>

          {pageLoading ? (
            <SkeletonLoader />
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="mx-[24px]">
                {/* Product Card */}
                <View className="mt-[44px] py-[8px] rounded-[8px] bg-white px-[10px]">
                  <View className="bg-white overflow-hidden">
                    <View className="flex-row items-center p-[12px]">
                      <View className="h-[94px] w-[120px]">
                        <Image
                          source={{ uri: productImage }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 8,
                          }}
                          resizeMode="cover"
                        />
                      </View>

                      <View className="ml-[26px] flex-1">
                        <Text
                          className="text-[#111827] text-[16px] font-urbanist-semibold"
                          numberOfLines={2}
                        >
                          {productName}
                        </Text>

                        <View className="flex-row items-center mt-[4px]">
                          <Text className="text-[#6B7280] text-[14px] font-urbanist-medium">
                            €{productPrice}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Feedback Input Section */}
                <View className="mt-[24px] bg-transparent rounded-[12px] border border-[#C4C4C4] p-[13px]">
                  <OreAppText className="text-[14px] text-[#2D2220] mb-[10px] mx-auto">
                    Your feedback on this item
                  </OreAppText>

                  <TextInput
                    className="bg-transparent rounded-[8px] p-[16px] text-[14px] font-urbanist-regular text-[#111827] min-h-[160px]"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={6}
                    selectionColor="#036047"
                    textAlignVertical="top"
                    value={comment}
                    onChangeText={setcomment}
                    maxLength={500}
                  />
                </View>

                {/* Submit Button */}
                <View className="mt-[32px]">
                  <Button
                    title="Submit"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading || !comment.trim()}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import Button from "@/common/Button";
import StarRating from "@/common/StarRating";
import { useLocalSearchParams, useRouter } from "expo-router";
import StoreApi from "@/api/StoreApi";
import showToast from "@/utils/showToast";
import { useNavigation } from "expo-router";

export default function WriteReviewScreen() {
  const navigation = useNavigation();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const [currentRating, setUserRating] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWriteReview = async () => {
    if (!storeId || isNaN(Number(storeId))) {
      Alert.alert("Error", "Invalid store ID.");
      return;
    }

    if (!currentRating) {
      showToast("error", "Please select a star rating.");
      return;
    }

    if (!text.trim()) {
      showToast("error", "Please write a review.");
      return;
    }

    try {
      setLoading(true);

      await StoreApi.createStoreReview({
        store: Number(storeId),
        rating: currentRating,
        message: text,
      });

      showToast("success", "Your review has been posted!");
      navigation.goBack();
    } catch (error: any) {
      console.log("Full error object:", error);
      if (error?.response?.status === 400) {
        const errorData = error.response.data;

        if (
          errorData?.non_field_errors?.includes(
            "You have already reviewed this store."
          )
        ) {
          showToast(
            "info",
            "You have already reviewed this store. You can only submit one review per store."
          );
          return;
        }

        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          errorData?.message ||
          "Invalid request. Please check your input.";
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", error?.message || "Failed to post review.");
      }
    } finally {
      setLoading(false);
    }
  };

  // console.log(storeId, currentRating, text);
  return (
    <ScreenWrapper>
      <Header title="Rate your shopping experience" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-[20px] bg-white rounded-[8px] py-[20px] px-[16px] mt-8">
            <Text className="font-urbanist-bold text-[16px] leading-[22px] text-[#2D2220] mx-auto mb-4">
              Star Rating
            </Text>

            <View className="items-center">
              <StarRating
                rating={currentRating}
                size={26.67}
                gap={16}
                color="#FF8A00"
                unfilledColor="#929292"
                onRatingChange={(rating) => setUserRating(rating)}
              />
            </View>
          </View>

          <View className="mx-[20px] bg-white rounded-[8px] py-[20px] px-[16px] mt-8">
            <Text className="font-urbanist-bold text-[16px] leading-[22px] text-[#2D2220] mx-auto pb-4">
              Write your review
            </Text>

            <View>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Enter Description"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor="#0C513F"
                className="border border-[#F1EAE7] rounded-[8px] py-[10px] px-[14px] font-urbanist text-[14px] h-[161px]"
                placeholderTextColor={"#929292"}
                style={{
                  textAlignVertical: "top",
                  borderColor: isFocused ? "#0C513F" : "#F1EAE7",
                }}
              />
            </View>
          </View>

          <View className="mx-[20px] mt-[24px]">
            <Button
              title={loading ? "Posting..." : "Post your review"}
              onPress={handleWriteReview}
              disabled={loading}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

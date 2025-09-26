import { View, Text, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import Button from "@/common/Button";
import StarRating from "@/common/StarRating";

export default function WriteReviewScreen() {
  const [currentRating, setUserRating] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const handleWriteReview = async () => {
    try {
        
    } catch (error) {
        
    }
  }

  return (
    <ScreenWrapper>
      <Header title="Rate your shopping experience" />
      <ScrollView>
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

        <View className="mx-[20px]  mt-[24px]  ">
          <Button title="Post your review" onPress={() => {}} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

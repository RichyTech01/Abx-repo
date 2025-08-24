import { View } from "react-native";
import StarRating from "./StarRating";
import UrbanistText from "./UrbanistText";
import OreAppText from "./OreApptext";
import VerifiedIcon from "@/assets/svgs/VerifiedIcon.svg";

type CustomerReviewProps = {
  rating: number;
  date: string;
  title: string;
  content: string;
  author: string;
  verified?: boolean;
};

export default function CustomerReview({
  rating,
  date,
  title,
  content,
  author,
  verified = false,
}: CustomerReviewProps) {
  return (
    <View className="bg-white border border-[#F1EAE7] rounded-[8px] py-[10px] px-[24px]">
      <View className="flex-row items-center justify-between">
        <StarRating rating={rating} />
        <UrbanistText className="text-[14px] text-[#1F1F1F] leading-[20px]">
          {date}
        </UrbanistText>
      </View>

      <View className="mt-[24px]">
        <OreAppText className="text-[16px] leading-[20px] text-[#1F1F1F]">
          {title}
        </OreAppText>
        <UrbanistText className="text-[14px] text-[#656565] leading-[20px] mt-[16px]">
          {content}
        </UrbanistText>
      </View>

      <View className="flex-row items-center justify-between mt-[32px]">
        <UrbanistText className="text-[14px] leading-[20px] text-[#656565]">
          From {author}
        </UrbanistText>

        {verified && (
          <View className="flex-row items-center">
            <VerifiedIcon />
            <UrbanistText className="ml-[4px] text-[12px] leading-[16px] text-[#05A85A]">
              Verified Purchase
            </UrbanistText>
          </View>
        )}
      </View>
    </View>
  );
}

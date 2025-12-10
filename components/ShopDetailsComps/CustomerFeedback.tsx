import { View } from "react-native";
import CustomerReview from "@/common/CustomerReview";
import UrbanistText from "@/common/UrbanistText";
import { formatDate } from "@/utils/formatDate";

type FeedbackItem = {
  id: number;
  rating: number;
  created_at: string;
  title: string;
  message: string;
  username: string;
  verified: boolean;
};

type CustomerFeedbackProps = {
  feedback: FeedbackItem[];
};

export default function CustomerFeedback({ feedback }: CustomerFeedbackProps) {
  if (!feedback || feedback.length === 0) {
    return (
      <View className="mt-[16px]">
        <UrbanistText className="py-10 mx-auto text-[16px]">
          No reviews yet.
        </UrbanistText>
        {/* <View className="mt-[16px]">
          <Button
            title="Write a review"
            fontClassName="urbanist"
            onPress={() => {}}
          />
        </View> */}
      </View>
    );
  }
  return (
    <View className="mt-[16px]">
      <View className="gap-[24px]">
        {feedback.map((item, index) => (
          <CustomerReview
            key={item.id ?? index}
            rating={item.rating}
            date={formatDate(item.created_at)}
            title={item.title || "Excellent service"}
            content={item.message}
            author={item.username}
            verified={item.verified || true}
          />
        ))}
      </View>
    </View>
  );
}

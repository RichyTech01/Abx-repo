import { View } from "react-native";
import CustomerReview from "@/common/CustomerReview";
import Button from "@/common/Button";
import UrbanistText from "@/common/UrbanistText";

type FeedbackItem = {
  id: number;
  rating: number;
  date: string;
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
        <UrbanistText className="py-10 mx-auto text-[16px]">No reviews yet.</UrbanistText>
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
            date={item.date || "13/03/25"}
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

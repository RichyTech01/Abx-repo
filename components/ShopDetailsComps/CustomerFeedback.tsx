import { View } from "react-native";
import CustomerReview from "@/common/CustomerReview";
import Button from "@/common/Button";

export default function CustomerFeedback() {
  return (
    <View className="mt-[16px]  ">
      <View className="gap-[24px]  ">
        <CustomerReview
          rating={4.7}
          date="12/02/25"
          title="Amazing Store!"
          content="The service and product exceeded my expectations—absolutely superb!"
          author="Chinaturum"
          verified
        />
        <CustomerReview
          rating={4.7}
          date="12/02/25"
          title="Amazing Store!"
          content="The service and product exceeded my expectations—absolutely superb!"
          author="Chinaturum"
          verified
        />
        <CustomerReview
          rating={4.7}
          date="12/02/25"
          title="Amazing Store!"
          content="The service and product exceeded my expectations—absolutely superb!"
          author="Chinaturum"
          verified
        />
      </View>
      <View className="mt-[16px]  ">
        <Button title="Write a review" fontClassName="urbanist" onPress={() => {}} />
      </View>
    </View>
  );
}

import { View } from "react-native";
import UrbanistText from "./UrbanistText";
import DropDownArrow from "@/assets/svgs/DropDownArrow";
import Carticon from "@/assets/svgs/Carticon";
import Button from "./Button";
import StarRating from "./StarRating";

interface CategoryProductProps {
  image: React.ReactNode;      
  name: string;                 
  price: string;               
  rating?: number;              
  sizes?: number;               
}

export default function CategoryProduct({
  image,
  name,
  price,
  rating = 0,
  sizes,
}: CategoryProductProps) {
  return (
    <View className="bg-white border border-[#E6E6E6] rounded-[8px] p-[10px] w-[187px] ">
      {image}

      <View className="mt-[8px]">
        <UrbanistText
          className="text-[16px] leading-[22px] text-[#4D4D4D]"
          style={{ fontFamily: "urbanist-medium" }}
        >
          {name}
        </UrbanistText>

        <UrbanistText
          className="text-[14px] leading-[20px] text-[#2D2220] mt-[4px]"
          style={{ fontFamily: "urbanist-semibold" }}
        >
          {price}
        </UrbanistText>

        <View className="py-[8px]">
          <StarRating rating={rating} />
        </View>

        {sizes !== undefined && (
          <View className="bg-[#F2F2F2] p-[4px] rounded-[8px] flex-row items-center justify-center max-w-[69px] gap-[4px]">
            <UrbanistText className="text-[#424242] text-[12px] leading-[16px]">
              Sizes: {sizes}
            </UrbanistText>
            <DropDownArrow />
          </View>
        )}

        <View className="mt-[8px]">
          <Button
            fontClassName="font-urbanist-medium"
            onPress={() => {}}
            icon={<Carticon stroke="#FFFFFF" />}
            title="Add to cart"
            iconPosition="left"
          />
        </View>
      </View>
    </View>
  );
}

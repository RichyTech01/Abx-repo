import {
  View,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
  Pressable
} from "react-native";
import UrbanistText from "./UrbanistText";
import DropDownArrow from "@/assets/svgs/DropDownArrow";
import Carticon from "@/assets/svgs/Carticon";
import Button from "./Button";
import StarRating from "./StarRating";

interface CategoryProductProps {
  image?: ImageSourcePropType;
  name: string;
  price: string;
  rating?: number;
  sizes?: number;
  onPress?: () => void;
  onAddToCart: () => void;
  isOutOfStock: boolean;
  isOpen: boolean;
}

export default function CategoryProduct({
  image,
  name,
  price,
  rating = 0,
  sizes,
  onPress,
  onAddToCart,
  isOpen,
}: CategoryProductProps) {
  // console.log("outofstock and open ", isOutOfStock, isOpen);
  return (
    <View  className="bg-white border border-[#E6E6E6] rounded-[8px] p-[10px] w-full">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!isOpen}
      >
        <Image source={image} className="h-[94px] w-full rounded-[4px]   " />
      </TouchableOpacity>

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

        {/* {sizes !== undefined && ( */}
        <Pressable className="bg-[#F2F2F2] p-[4px] rounded-[8px] flex-row items-center justify-center max-w-[69px] gap-[4px]"  onPress={onAddToCart}>
          <UrbanistText className="text-[#424242] text-[12px] leading-[16px]">
            Sizes:
          </UrbanistText>
          <DropDownArrow />
        </Pressable>
        {/* )} */}

        <View className="mt-[8px]">
          <Button
            fontClassName="font-urbanist-medium"
            onPress={onAddToCart}
            icon={<Carticon stroke="#FFFFFF" />}
            title="Add to cart"
            iconPosition="left"
            paddingVertical={9}
            disabled={!isOpen}
          />
        </View>
      </View>
    </View>
  );
}

import {
  View,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
  Pressable,
  Text,
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
  distance?: number;
  onPress?: () => void;
  onAddToCart: () => void;
  isOutOfStock: boolean;
  isOpen: boolean;
  discountPercent?: number;
}

export default function CategoryProduct({
  image,
  name,
  price,
  rating = 0,
  distance,
  onPress,
  onAddToCart,
  isOpen,
  discountPercent,
}: CategoryProductProps) {
  // console.log("outofstock and open ", discountPercent, isOpen);
  return (
    <View className="bg-white border border-[#E6E6E6] rounded-[8px] p-[10px] w-full">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!isOpen}
      >
        {discountPercent ? (
          <View className="py-[2px] px-[8px] rounded-[4px] bg-[#F4B551] absolute z-50 my-2 mx-2 ">
            <Text className="text-[12px] leading-[16px] font-urbanist text-white">
              Sale {discountPercent}%
            </Text>
          </View>
        ) : (
          <View style={{ width: 1 }} />
        )}
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

        {distance ? (
          <Text className="text-[12px] leading-[16px] font-urbanist-semibold text-[#2D2220] my-[4px] ">
            {distance} km
          </Text>
        ) : null}

        <View className="py-[8px]">
          <StarRating rating={rating} />
        </View>

        <Pressable
          className="bg-[#F2F2F2] p-[4px] rounded-[8px] flex-row items-center justify-center max-w-[69px] gap-[4px]"
          onPress={onAddToCart}
        >
          <UrbanistText className="text-[#424242] text-[12px] leading-[16px]">
            Sizes:
          </UrbanistText>
          <DropDownArrow />
        </Pressable>

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

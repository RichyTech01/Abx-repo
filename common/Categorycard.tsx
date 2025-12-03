import {
  View,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";

interface CategoryCardProps {
  bgColor: string;
  borderColor: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  width?: number;
  paddingY?: number;
  onPress: () => void;
  Height?: number;
}

export default function CategoryCard({
  bgColor,
  borderColor,
  title,
  subtitle,
  image,
  width = 176,
  paddingY = 20,
  Height = 136,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      className="rounded-[16px] px-[10px] items-center h-full"
      style={{
        backgroundColor: bgColor,
        width,
        paddingVertical: paddingY,
        height: Height,
      }}
      onPress={onPress}
    >
      <View
        className="border-dashed rounded-full bg-transparent p-[5px]"
        style={{ borderColor, borderWidth: 1 }}
      >
        <Image
          source={image}
          style={{ width: 40, height: 40 }}
          className="rounded-full "
        />
      </View>

      <View className="mt-[8px] items-center">
        <Text
          className="text-[#2C2C2C] text-[14px] font-urbanist-semibold leading-[20px]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text
          className="text-[#424242] text-[12px] font-urbanist-semibold leading-[16px] text-center"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

import {
  View,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";

interface CategoryCardProps {
  bgColor: string;
  borderColor: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  width?: number;
  paddingY?: number;
  onPress: () => void
}

export default function CategoryCard({
  bgColor,
  borderColor,
  title,
  subtitle,
  image,
  width = 176,
  paddingY = 20,
  onPress
}: CategoryCardProps) {
  const router = useRouter();
  console.log(image);
  return (
    <Pressable
      className="rounded-[16px] px-[10px] items-center"
      style={{ backgroundColor: bgColor, width, paddingVertical: paddingY }}
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
        <Text className="text-[#2C2C2C] text-[14px] font-urbanist-semibold leading-[20px]">
          {title}
        </Text>
        <Text className="text-[#424242] text-[12px] font-urbanist-semibold leading-[16px] text-center">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

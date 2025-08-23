import React from "react";
import { View, Text, Pressable} from "react-native";
import { useRouter } from "expo-router";

interface CategoryCardProps {
  bgColor: string;        
  borderColor: string;    
  Icon: React.ReactNode;  
  title: string;         
  subtitle: string;    
  width?: number;        
  paddingY?: number;     
}

export default function CategoryCard({
  bgColor,
  borderColor,
  Icon,
  title,
  subtitle,
  width = 176,   
  paddingY = 20
}: CategoryCardProps) {

  const router = useRouter()

  return (
    <Pressable
      className="rounded-[16px] px-[10px] items-center"
      style={{ backgroundColor: bgColor, width, paddingVertical: paddingY }}
      onPress={() => router.push("/Screens/CategoryDetails")}
    >
      <View
        className="border-dashed rounded-full bg-transparent p-[5px]"
        style={{ borderColor, borderWidth: 1 }}
      >
        {Icon}
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

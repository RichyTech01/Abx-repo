import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import OreAppText from "./OreApptext";
import Backarrow from "@/assets/svgs/BackArrow.svg"


export default function Header({ title }: { title: string }) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-[15px] py-[8px]">
      <TouchableOpacity className="w-[24px] h-[24px] items-center justify-center " onPress={() => navigation.goBack()}>
         <Backarrow/> 
      </TouchableOpacity>

      <OreAppText className="text-[20px] leading-[28px] font-urbanist-bold text-[#2D2220] ">{title}</OreAppText>

      <View style={{ width: 40 }} />
    </View>
  );
}

import { View, Text, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import NotificationIcon from "@/assets/svgs/NotificationIcon";
import React from "react";

export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1 ">
      <View className="mx-[20px]  flex-row items-center justify-between  ">
        <Text className="text-[20px] tetx-[#2D2220] leading-[28px] font-orelega  ">
          Welcome, Angela!
        </Text>
        <View className="flex-row items-center gap-[20px]">
          <View className="relative ">
            <View className="bg-[#F04438] w-[20px] h-[20px] items-center justify-center  rounded-full absolute top-0 right-0 ml-10 z-10 ">
              <Text className="text-[#F1D3D1]  font-urbanist-bold text-[10px] leading-[14px]">
                3
              </Text>
            </View>
            <NotificationIcon />
          </View>
          <View className="bg-[#F9DAA8] h-[35px] w-[35px] rounded-full    "></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

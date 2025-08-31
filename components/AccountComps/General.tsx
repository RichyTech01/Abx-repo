import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import OreAppText from "@/common/OreApptext";
import AllStoreIcon from "@/assets/svgs/AllStoresIcon.svg";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import FavoriterIcon from "@/assets/svgs/FavoriteIcon.svg";
import RescueAndSave from "@/assets/svgs/RAndSIcon.svg";

export default function General() {
  const router = useRouter();

  return (
    <View className="mt-[24px]   ">
      <OreAppText className="text-[#2D2220] text-[16px] leading-[20px]  ">
        General
      </OreAppText>

      <View className="border border-[#F1EAE7] rounded-[8px] py-[10px px-[8px] bg-white mt-[18px] ">
        <TouchableOpacity
          className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between "
          onPress={() => router.push("/Screens/AccountScreen/AllStore")}
        >
          <View className="flex-row items-center ">
            <AllStoreIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              All stores
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity
          className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between "
          onPress={() => router.push("/Screens/AccountScreen/FavouriteStore")}
        >
          <View className="flex-row items-center ">
            <FavoriterIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Favorite stores
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity
          className="py-[10px] pl-[4px] flex-row items-center justify-between "
          onPress={() => router.push("/Screens/AccountScreen/RescueAndSave")}
        >
          <View className="flex-row items-center ">
            <RescueAndSave />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Rescue and save
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { View, Text, SafeAreaView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import NotificationIcon from "@/assets/svgs/NotificationIcon";
import MaincartIcon from "@/assets/svgs/MaincartIcon";
import Welcomebanner from "@/assets/svgs/Welcomebanner";
import SearchInput from "@/common/SearchInput";


import Categories from "@/components/HomeComps/Categories";
import TopratedShops from "@/components/HomeComps/TopratedShops";
import ClosestShops from "@/components/HomeComps/ClosestShops";
import NewProducts from "@/components/HomeComps/NewProducts";
import BestSelling from "@/components/HomeComps/BestSelling";
import SpendingLimit from "@/components/HomeComps/SpendingLimit";
import RescueAndSave from "@/components/HomeComps/RescueAndSave";
import RecueAndSaveProduct from "@/components/HomeComps/RecueAndSaveProduct";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      {/* Header */}
      <View
        className={`mx-[20px] flex-row items-center justify-between ${
          Platform.OS === "android" ? "pt-16" : "mt-3"
        }`}
      >
        <Text className="text-[20px] text-[#2D2220] leading-[28px] font-orelega">
          Welcome, Bankole!
        </Text>
        <View className="flex-row items-center gap-[20px]">
          <NotificationIcon />
          <View className="bg-[#F9DAA8] h-[35px] w-[35px] rounded-full items-center justify-center">
            <MaincartIcon />
          </View>
        </View>
      </View>

      {/* Search input */}
      <View className="mx-[20px] mt-[24px]">
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ask ABX AI or search for food items of your choice"
        />
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Welcome banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-[32px] pl-[20px]"
          contentContainerStyle={{ gap: 12 }}
        >
          <Welcomebanner />
          <Welcomebanner />
        </ScrollView>

        {/* Sections */}
        <View className="mt-[24px] gap-[24px] ">
          <Categories />
          <TopratedShops />
          <ClosestShops />
          <RescueAndSave />
          <NewProducts />
          <BestSelling />
          <SpendingLimit />
          <RecueAndSaveProduct />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

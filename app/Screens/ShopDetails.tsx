import { View, SafeAreaView, Platform, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import { useState } from "react";
import TabSwitcher from "@/common/TabSwitcher";
import UrbanistText from "@/common/UrbanistText";
import AboutStore from "@/components/ShopDetailsComps/AboutStore";
import CustomerFeedback from "@/components/ShopDetailsComps/CustomerFeedback";

const ShopBanner = require("../../assets/Images/Frame 1000008001.png");

export default function ShopDetails() {
  const [activeTab, setActiveTab] = useState<string>("About store");
   const { shop } = useLocalSearchParams ();

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <View
        className={`${Platform.OS === "android" ? "mt-[45px]" : ""} pb-[15px]`}
      >
        <HeaderWithSearchInput label="Closest shops" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image source={ShopBanner} alt="banner" />
        </View>

        <View className="bg-white py-[24px] px-[10px] mt-[18px] mx-[15px] rounded-[4px] ">
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={["About store", "Customer feedback"]}
          />

          {activeTab === "About store" && (
            <UrbanistText className="text-[#808080] text-[14px] leading-[21px] mt-[16px] mx-[23.5px]">
              ABX 09876436 shop is a trusted local store known for its fresh,
              high-quality Nigerian food items and household essentials. Whether
              you're looking for premium Egusi, Ogbono, dried fish, palm oil, or
              freshly ground pepper, Iya Oyo&apos;s Shop has got you covered.
            </UrbanistText>
          )}

          {activeTab === "Customer feedback" && (
            <View>
              <CustomerFeedback />
            </View>
          )}
        </View>

        {activeTab === "About store" && (
          <View className="mx-[21px]">
            <AboutStore />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

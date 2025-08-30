import { View, ScrollView, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import TabSwitcher from "@/common/TabSwitcher";
import UrbanistText from "@/common/UrbanistText";
import AboutStore from "@/components/ShopDetailsComps/AboutStore";
import CustomerFeedback from "@/components/ShopDetailsComps/CustomerFeedback";
import ScreenWrapper from "@/common/ScreenWrapper";
import StoreApi from "@/api/StoreApi";
import { isStoreOpen } from "@/utils/storeStatus";

const ShopBanner = require("../../assets/Images/Frame 1000008001.png");

export default function ShopDetails() {
  const [activeTab, setActiveTab] = useState<string>("About store");
  const { id } = useLocalSearchParams();

  // Fetch store details
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["storeDetails", id],
    queryFn: () => StoreApi.getStoreById(Number(id)),
    enabled: !!id,
  });

  // Fetch store reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["storeReviews", id],
    queryFn: () => StoreApi.getStoreReviews(Number(id)),
    enabled: !!id,
  });

  const reviewsArray = reviews?.results ?? [];


  return (
    <ScreenWrapper>
      <HeaderWithSearchInput label="Closest shops" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {storeLoading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
        <Image source={ShopBanner} alt="banner" />

        <View className="bg-white py-[24px] px-[10px] mt-[18px] mx-[15px] rounded-[4px] ">
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={["About store", "Customer feedback"]}
          />

          {activeTab === "About store" && (
            <UrbanistText className="text-[#808080] text-[14px] leading-[21px] mt-[16px] mx-[23.5px]">
              {store?.store_description || "No description available."}
            </UrbanistText>
          )}

          {activeTab === "Customer feedback" && (
            <View className="mt-[16px]">
              {reviewsLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <CustomerFeedback feedback={reviewsArray || []} />
              )}
            </View>
          )}
        </View>

        {activeTab === "About store" && (
          <View className="mx-[21px]">
            <AboutStore  />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

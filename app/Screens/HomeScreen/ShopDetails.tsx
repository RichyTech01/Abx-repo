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

export default function ShopDetails() {
  const [activeTab, setActiveTab] = useState<string>("About store");
  const [isSticky, setIsSticky] = useState(false);
  const { id, image } = useLocalSearchParams<{ id: string; image: string }>();

  const BANNER_HEIGHT = 112 + 14; // Banner height + margin

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
  const storeId = Number(id);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsSticky(scrollY >= BANNER_HEIGHT);
  };

  return (
    <ScreenWrapper>
      <HeaderWithSearchInput label="Shop Details" />

      {storeLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="flex-1">
          {/* Sticky TabSwitcher - appears when scrolled */}
          {isSticky && (
            <View className="bg-white py-[24px] px-[10px] mx-[15px] rounded-[4px] absolute top-0 left-0 right-0 z-10">
              <TabSwitcher
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={["About store", "Customer feedback"]}
              />
            </View>
          )}

          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Banner */}
            <Image
              source={{
                uri:
                  image 
                    ? image
                    : "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
              }}
              alt="banner"
              className="w-full h-[112px] mt-[14px]"
            />

            {/* TabSwitcher Container */}
            <View className="bg-white px-[10px] mt-[18px] mx-[15px] rounded-[4px]" style={{paddingTop:24}}>
              <TabSwitcher
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={["About store", "Customer feedback"]}
              />
            </View>

            {/* Content that scrolls under sticky tab */}
            <View className="bg-white py-[24px] px-[10px] mx-[15px] rounded-[4px] -mt-[18px]  ">
              {activeTab === "About store" && (
                <UrbanistText className="text-[#808080] text-[14px] leading-[21px] mt-[16px] mx-[23.5px]">
                  {store?.store_description || "No description available."}
                </UrbanistText>
              )}

              {activeTab === "Customer feedback" && (
                <View className="mt-[16px">
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
                <AboutStore id={storeId} image={image} />
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </ScreenWrapper>
  );
}
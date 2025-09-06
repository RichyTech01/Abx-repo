import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import Button from "@/common/Button";
import Carticon from "@/assets/svgs/Carticon";
import DropDownIcon from "@/assets/svgs/DropDownArrow";
import UrbanistText from "@/common/UrbanistText";
import OreAppText from "@/common/OreApptext";
import { isStoreOpen } from "@/utils/storeStatus";
import VendorIcon from "@/assets/svgs/VendorIcon.svg";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import StoreApi from "@/api/StoreApi";
import React, { useState } from "react";
import { ShopProductType, ProductVariation } from "@/types/store";
import showToast from "@/utils/showToast";

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showModal, setShowModal] = useState(false);

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery<ShopProductType>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid product id");
      return await StoreApi.getProduct(Number(id));
    },
    enabled: !!id,
  });

  if (error) {
    showToast("error", (error as Error).message || "Failed to load product");
  }

  // const SCREEN_PADDING = 20;
  // const GAP = 16;
  // const ITEM_WIDTH =
  //   (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1 ">
      <View
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <HeaderWithSearchInput
          label="Product detail"
          placeholder="Ask ABX AI or search for food items of your choice"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : !productData ? (
        <View className="flex-1 items-center justify-center">
          <Text>Product not found</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 45 }}
          showsVerticalScrollIndicator={false}
        >
          {(() => {
            const isOpen = isStoreOpen(
              productData.store.open_time,
              productData.store.close_time
            );
            console.log("variation", productData.variations);
            return (
              <View className="mx-[20px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[26px]  px-[7px] py-[15px] ">
                <View className="px-[]">
                  <Image
                    source={{ uri: productData.prod_image_url }}
                    className="h-[180px] w-full rounded-[4px]  "
                  />
                </View>

                <View className="mt-[18px] gap-[20px] mx-[7px]">
                  <TouchableOpacity className="flex-row items-center gap-[8.5px] bg-[#F2F2F2] rounded-[8px] p-[11px] justify-center">
                    <UrbanistText className="text-[#424242] ">
                      Select size: 4
                    </UrbanistText>
                    <DropDownIcon />
                  </TouchableOpacity>

                  <Button
                    fontClassName="font-urbanist-medium"
                    onPress={() => setShowModal(!showModal)}
                    icon={<Carticon stroke={"#FFFFFF"} />}
                    title="Add to cart"
                    iconPosition="left"
                  />
                </View>

                <View className="px-[16px] mt-[13px]">
                  <OreAppText className="text-[#424242] text-[20px] leading-[28px]">
                    Product description
                  </OreAppText>
                  <UrbanistText
                    className="text-[16px] text-[#424242] leading-[22px] mt-[8px]"
                    style={{ fontFamily: "UrbanistSemiBold" }}
                  >
                    {productData.item_name}
                  </UrbanistText>
                  <UrbanistText className="text-[#808080] text-[16px] leading-[22px] mt-[18px]  ">
                    {productData.item_description}
                  </UrbanistText>

                  <View className="mt-[8px] ">
                    <UrbanistText className="text-[#424242] text-[16px] leading-[22px]   ">
                      Price range{" "}
                      <UrbanistText
                        className="text-[#424242] text-[16px] leading-[22px]"
                        style={{ fontFamily: "UrbanistSemiBold" }}
                      >
                        - €{productData.min_price}-€{productData.max_price}
                      </UrbanistText>{" "}
                    </UrbanistText>

                    <UrbanistText className="text-[#424242] text-[16px] leading-[22px]  mt-[12px] ">
                      Expiration date{" "}
                      <UrbanistText
                        className="text-[#424242] text-[16px] leading-[22px]"
                        style={{ fontFamily: "UrbanistSemiBold" }}
                      >
                        - {productData.expiration_date}
                      </UrbanistText>{" "}
                    </UrbanistText>
                  </View>
                </View>

                <View className="py-[4px] px-[16px] mt-[18px] border-t border-[#F1EAE7] ">
                  <OreAppText className="text-[20px]  leading-[28px] text-[#424242]     ">
                    Vendor details
                  </OreAppText>

                  <View className="flex-row items-center justify-between mt-[12px] ">
                    <View className="flex-row items-center ">
                      <VendorIcon />
                      <UrbanistText className="text-[#424242] text-[14px] leading-[20px] ml-[8px]   ">
                        {productData.store.store_code}
                      </UrbanistText>
                    </View>
                    <View
                      className={`py-[3px] px-[8px] rounded-[4px] ${
                        isOpen ? "bg-[#05A85A]" : "bg-[#F04438]"
                      }`}
                    >
                      <UrbanistText className="text-[12px] leading-[16px] text-white">
                        {isOpen ? "Store is open" : "Store is closed"}
                      </UrbanistText>
                    </View>
                  </View>
                </View>

                <View className="mt-[18px]  ">
                  <Button
                    title="More information about this product"
                    variant="outline"
                    borderColor="#D7D7D7"
                    textColor="More information about this product"
                    onPress={() => {}}
                  />
                </View>

                <View className="mt-[24px]  ">
                  <Text className="text-[#424242] text-[16px] font-urbanist-semibold mx-[16px] ">
                    Other items from this store
                  </Text>
                  <View className="mt-[10px]   ">
                    {/* <FlatList
                      data={productData.variations}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={2}
                      scrollEnabled={false}
                      contentContainerStyle={{
                        paddingHorizontal: SCREEN_PADDING,
                        paddingTop: 16,
                        paddingBottom: 40,
                      }}
                      columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: GAP,
                      }}
                      renderItem={({ item }) => (
                        <View style={{ width: ITEM_WIDTH }}>
                          <CategoryProduct
                            image={{ uri: item.prod_image_url }}
                            name={item.item_name}
                            price={`€${item.display_price} - €${item.display_price}`}
                            rating={2}
                            onPress={() =>
                              router.push({
                                pathname: "/Screens/ProductDetails",
                                params: { id: item.id },
                              })
                            }
                          />
                        </View>
                      )}
                    /> */}
                  </View>
                </View>
              </View>
            );
          })()}
        </ScrollView>
      )}
      <AddtoCartModal
        value={showModal}
        setValue={setShowModal}
        data={(productData?.variations ?? []) as ProductVariation[]}
        loading={isLoading}
        isOpen={
          productData
            ? isStoreOpen(
                productData.store.open_time,
                productData.store.close_time
              )
            : false
        }
      />
    </SafeAreaView>
  );
}

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import ProductDetailImg from "@/assets/svgs/ProductDetailsImg.svg";
import Button from "@/common/Button";
import Carticon from "@/assets/svgs/Carticon";
import DropDownIcon from "@/assets/svgs/DropDownArrow";
import UrbanistText from "@/common/UrbanistText";
import OreAppText from "@/common/OreApptext";
import VendorIcon from "@/assets/svgs/VendorIcon.svg";

export default function ProductDetails() {
  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1 ">
      <View className={`${Platform.OS === "android"?"mt-[45px] ":""}`}>
        <HeaderWithSearchInput
          label="Product detail"
          placeholder="Ask ABX AI or search for food items of your choice"
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 45 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-[20px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[26px]  px-[7px] py-[15px] ">
          <View>
            <ProductDetailImg />
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
              onPress={() => {}}
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
              Egusi (Mellon seed)
            </UrbanistText>
            <UrbanistText className="text-[#808080] text-[16px] leading-[22px] mt-[18px]  ">
              Egusi is a versatile ingredient that can be used in soups, stews,
              and even as a thickener for sauces. Whether you're enjoying a warm
              bowl of Egusi soup with pounded yam or incorporating it into other
              meals, you're not just indulging in rich flavors but also
              nourishing your body with essential nutrients.{"\n"} Egusi is a
              versatile ingredient that can be used in soups, stews, and even as
              a thickener for sauces. Whether you're enjoying a warm bowl of
              Egusi soup with pounded yam or incorporating it into other meals,
              you're not just indulging in rich flavors but also nourishing your
              body with essential nutrients.
            </UrbanistText>

            <View className="mt-[8px] ">
              <UrbanistText className="text-[#424242] text-[16px] leading-[22px]   ">
                Price range{" "}
                <UrbanistText
                  className="text-[#424242] text-[16px] leading-[22px]"
                  style={{ fontFamily: "UrbanistSemiBold" }}
                >
                  - €14.99-€19.99
                </UrbanistText>{" "}
              </UrbanistText>

              <UrbanistText className="text-[#424242] text-[16px] leading-[22px]  mt-[12px] ">
                Expiration date{" "}
                <UrbanistText
                  className="text-[#424242] text-[16px] leading-[22px]"
                  style={{ fontFamily: "UrbanistSemiBold" }}
                >
                  -15th June 2025
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
                  ABX09836278
                </UrbanistText>
              </View>
              <View className="bg-[#05A85A] py-[3px] px-[8px]  rounded-[4px]  ">
                <UrbanistText className="text-[12px] leading-[16px] text-white   ">
                  Store is open
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

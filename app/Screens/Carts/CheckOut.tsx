import { View, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import AddDeliveryAddressModal from "@/Modals/AddDeliveryAddressModal";
import OrderSummaryCartItem from "@/common/OrderSummaryCartItem";

export default function CheckOut() {
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <Header title="Check out" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Details */}
        <View className="py-[19px] bg-white px-[17px] mt-[32px] mx-[16px] rounded-[4.68px] border border-[#F1EAE7]">
          <View>
            <OreAppText className="text-[14px] leading-[18px] text-[#424242]">
              Contact Details
            </OreAppText>
            <View className="gap-[4.68px] mt-[8px]">
              <UrbanistText className="text-[12px] leading-[16px] text-[#2C2C2C]">
                Angela Thriving
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[16px] text-[#535353]">
                angelaisthriving@gmail.com
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[16px] text-[#535353]">
                +44 7700 900123
              </UrbanistText>
            </View>
          </View>

          <View className="py-[4.68px] border-t-[0.58px] border-[#F1EAE7] mt-[9px]">
            <OreAppText className="text-[14px] leading-[18px] text-[#424242]">
              Default Address
            </OreAppText>
            <View className="gap-[4.68px] mt-[8px]">
              <UrbanistText className="text-[12px] leading-[12.87px] text-[#535353]">
                G1 1AA
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[12.87px] text-[#2C2C2C]">
                Flat 3, Chester street, Glasgow UK
              </UrbanistText>
            </View>
          </View>

          <View className="mt-[16px]">
            <Button
              title="Change delivery address"
              variant="outline"
              textColor="#0C513F"
              fontClassName="urbanist"
              borderColor="#0C513F"
              onPress={() => setShowModal((prev) => !prev)}
            />
          </View>
        </View>

        {/* Order Summary */}
        <View className="py-[16px] px-[8px] rounded-[8px] mt-[8px] mx-[16px] bg-white">
          <OreAppText className="text-[16px] leading-[17.14px] text-[#1A1A1A] mx-auto">
            Order Summary
          </OreAppText>

          <View className="mt-[20.57px] gap-[13.71px] pr-[12.29px]">
            <OrderSummaryCartItem
              title="Egusi (Melon seed)"
              weight="10kg"
              quantity={5}
              price="£70.00"
            />
            <OrderSummaryCartItem
              title="Yam"
              weight="10kg"
              quantity={5}
              price="£70.00"
            />
          </View>

          {/* Totals */}
          <View className="border-t border-[#F1EAE7] py-[4px] mt-[8px] mr-[11px] gap-[8px]">
            <View className="flex-row items-center justify-between">
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                Sub total
              </UrbanistText>
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                €300.00
              </UrbanistText>
            </View>
            <View className="flex-row items-center justify-between">
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                Delivery fee
              </UrbanistText>
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                €300.00
              </UrbanistText>
            </View>
            <View className="flex-row items-center justify-between">
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                Vat
              </UrbanistText>
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                €300.00
              </UrbanistText>
            </View>
            <View className="flex-row items-center justify-between">
              <UrbanistText
                className="text-[14px] text-[#2D2220] leading-[20px]"
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                Total
              </UrbanistText>
              <UrbanistText
                className="text-[16px] text-[#2D2220] leading-[22px]"
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                €330.00
              </UrbanistText>
            </View>
          </View>

          <View className="mt-[32px] mx-[10px]">
            <Button title="Make payment" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
      {showModal && (
        <AddDeliveryAddressModal
          onClose={() => setShowModal(false)}
          visible={showModal}
        />
      )}
    </SafeAreaView>
  );
}

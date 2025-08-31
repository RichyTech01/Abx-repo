import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import Header from "@/common/Header";
import { useLocalSearchParams } from "expo-router";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import AddDeliveryAddressModal from "@/Modals/AddDeliveryAddressModal";
import OrderSummaryCartItem from "@/common/OrderSummaryCartItem";
import { useUserStore } from "@/store/useUserStore";
import { Address } from "@/types/carts";
import OrderApi from "@/api/OrderApi";

export default function CheckOut() {
  const [showModal, setShowModal] = useState(false);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    const Checkout = async () => {
      try {
        const data = await OrderApi.checkout();
        setCartDetails(data);
      } catch (error) {
        console.error("Checkout error:", error);
      }
    };
    Checkout();
    if (!user) fetchUser();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await OrderApi.getMyAddress();
        setAddress(data);
        console.log("adress",data);
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, []);

  const handlePayment = async () => {
    try {
      setLoadingPayment(true);
      const res = await OrderApi.initiatePayment();
      console.log("Payment response:", res);
      Alert.alert("Success", "Payment initiated successfully.");
    } catch (error: any) {
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Header title="Check out" />
      </View>

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
                {user?.first_name} {user?.last_name}
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[16px] text-[#535353]">
                {user?.email}
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[16px] text-[#535353]">
                {user?.phone_number}
              </UrbanistText>
            </View>
          </View>

          {/* Default Address */}
          <View className="py-[4.68px] border-t-[0.58px] border-[#F1EAE7] mt-[9px]">
            <OreAppText className="text-[14px] leading-[18px] text-[#424242]">
              Default Address
            </OreAppText>
            <View className="gap-[4.68px] mt-[8px]">
              <UrbanistText className="text-[12px] leading-[12.87px] text-[#535353]">
                {address?.post_code}
              </UrbanistText>
              <UrbanistText className="text-[12px] leading-[12.87px] text-[#2C2C2C]">
                {address?.addr},
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
            {cartDetails?.cart_items?.length > 0 ? (
              cartDetails.cart_items.map((cartItem: any) => (
                <OrderSummaryCartItem
                  key={cartItem.id}
                  title={cartItem.item.product.item_name}
                  weight={`${cartItem.item.weight}kg`}
                  quantity={cartItem.quantity}
                  price={`€${cartItem.total_item_price.toFixed(2)}`}
                  image={{ uri: cartItem.item.product.prod_image_url }}
                />
              ))
            ) : (
              <UrbanistText className="text-[14px] text-[#2C2C2C]">
                Your cart is empty
              </UrbanistText>
            )}
          </View>

          {/* Totals */}
          <View className="border-t border-[#F1EAE7] py-[4px] mt-[8px] mr-[11px] gap-[8px]">
            <View className="flex-row items-center justify-between">
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                Sub total
              </UrbanistText>
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                €{cartDetails?.subtotal?.toFixed(2) ?? "0.00"}
              </UrbanistText>
            </View>
            <View className="flex-row items-center justify-between">
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                Delivery fee
              </UrbanistText>
              <UrbanistText className="text-[14px] text-[#2D2220] leading-[20px]">
                €{cartDetails?.total_delivery_fee?.toFixed(2) ?? "0.00"}
              </UrbanistText>
            </View>
            <View className="flex-row items-center justify-between">
              <UrbanistText
                className="text-[16px] text-[#2D2220] leading-[22px]"
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                Total
              </UrbanistText>
              <UrbanistText
                className="text-[16px] text-[#2D2220] leading-[22px]"
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                €{cartDetails?.grand_total?.toFixed(2) ?? "0.00"}
              </UrbanistText>
            </View>
          </View>

          <View className="mt-[32px] mx-[10px]">
            <Button
              title={loadingPayment ? "Processing..." : "Make payment"}
              onPress={handlePayment}
              disabled={loadingPayment}
            />
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

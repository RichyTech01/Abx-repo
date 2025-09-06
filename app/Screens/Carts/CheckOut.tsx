import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useConfirmPayment } from "@stripe/stripe-react-native";
import Header from "@/common/Header";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import AddDeliveryAddressModal from "@/Modals/AddDeliveryAddressModal";
import OrderSummaryCartItem from "@/common/OrderSummaryCartItem";
import CardFieldModal from "@/Modals/CardFieldModal";
import { useUserStore } from "@/store/useUserStore";
import { Address } from "@/types/carts";
import showToast from "@/utils/showToast";
import OrderApi from "@/api/OrderApi";
import PaymentSuccessModal from "@/Modals/PaymentSuccessModal";

export default function CheckOut() {
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { user, fetchUser } = useUserStore();
  const { confirmPayment } = useConfirmPayment();

  const fetchAddress = async () => {
    try {
      const data = await OrderApi.getMyAddress();
      setAddress(data);
      console.log("Address fetched:", data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn("No address found for user. Please add one.");
        setAddress(null);
      } else {
        console.error("Failed to fetch address:", err);
      }
    }
  };

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
    fetchAddress();
  }, []);

  const initiatePaymentFlow = async () => {
    if (!address) {
      showToast(
        "error",
        "Please select or add a delivery address before paying."
      );
      return;
    }
    if (!cartDetails?.grand_total) {
      showToast("error", "Cart total not found.");
      return;
    }

    try {
      setLoadingPayment(true);

      const res = await OrderApi.initiatePayment({
        total_price: cartDetails?.grand_total,
      });

      console.log("Payment response:", res);
      const clientSecret = res.client_secret;

      if (!clientSecret) {
        showToast(
          "error",
          "Payment initiation failed: no client secret returned."
        );
        return;
      }

      // Store client secret and show payment modal
      setClientSecret(clientSecret);
      setShowPaymentModal(true);
      showToast(
        "success",
        "Payment initiated. Please enter your card details."
      );
    } catch (err: any) {
      console.error("Payment initiation error:", err.response?.data || err);
      showToast(
        "error",
        err.response?.data?.message || "Payment initiation failed."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      showToast("error", "Please enter complete card details.");
      return;
    }
    if (!clientSecret) {
      showToast("error", "Payment session expired. Please try again.");
      return;
    }

    try {
      setLoadingPayment(true);

      // Process payment with Stripe
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: user?.email,
            name: `${user?.first_name} ${user?.last_name}`,
          },
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        showToast("error", error.message || "Payment failed.");
      } else {
        console.log("Payment succeeded:", paymentIntent);
        showToast("success", "Payment completed successfully!");
        setShowPaymentModal(false);
        setShowSuccessModal((prev) => !prev);
        setClientSecret(null);
        setCardDetails(null);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      showToast("error", "Payment processing failed.");
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
          <View className="border-t border-[#F1EAE7] py-[4px] mt-[8px] mr-[11px] gap-[8px] ">
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
              title={"Proceed to Payment"}
              onPress={initiatePaymentFlow}
              disabled={loadingPayment}
              loading={loadingPayment}
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

      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal((prev) => !prev)}
      />

      <CardFieldModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal((prev) => !prev)}
        cardDetails={cardDetails}
        setCardDetails={setCardDetails}
        handlePayment={handlePayment}
        loadingPayment={loadingPayment}
      />
    </SafeAreaView>
  );
}

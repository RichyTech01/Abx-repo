import React from "react";
import {
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import OreAppText from "@/common/OreApptext";
import Button from "@/common/Button";

// derive Stripe's type properly
type StripeCardFieldInput = Parameters<
  NonNullable<React.ComponentProps<typeof CardField>["onCardChange"]>
>[0];

export type CustomCardFieldInput = StripeCardFieldInput & {
  postalCode?: string;
  country?: string;
};

type CardFieldModalProps = {
  visible: boolean;
  onClose: () => void;
  cardDetails: CustomCardFieldInput | null;
  setCardDetails: React.Dispatch<
    React.SetStateAction<CustomCardFieldInput | null>
  >;
  handlePayment: () => void;
  loadingPayment?: boolean;
};

export default function CardFieldModal({
  visible,
  onClose,
  cardDetails,
  setCardDetails,
  handlePayment,
  loadingPayment = false,
}: CardFieldModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable
            className="bg-white py-[24px] px-[10px] rounded-[16px] border border-[#F1EAE7]"
            onPress={(e) => e.stopPropagation()}
          >
            <OreAppText className="text-[16px] mx-auto leading-[20px] text-[#2D2220]">
              Input Card Details
            </OreAppText>

            <CardField
              postalCodeEnabled
              placeholders={{ number: "4242 4242 4242 4242" }}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                textColor: "#000000",
                fontSize: 16,
                placeholderColor: "#999999",
              }}
              style={{ width: "100%", height: 50, marginVertical: 8 }}
              onCardChange={(details) => setCardDetails(details)}
            />

            <View className="mt-[16px] flex-row gap-[8px]">
              <View className="flex-1">
                <Button
                  title={"cancel"}
                  variant="outline"
                  textColor="#0C513F"
                  borderColor="#0C513F"
                  onPress={onClose}
                />
              </View>
              <View className="flex-1">
                <Button
                  title={"Complete Payment"}
                  onPress={handlePayment}
                  disabled={loadingPayment || !cardDetails?.complete}
                  loading={loadingPayment}
                />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

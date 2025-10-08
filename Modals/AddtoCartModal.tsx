import {
  View,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import OreAppText from "@/common/OreApptext";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import CancelModalIcon from "@/assets/svgs/CancelModalIcon.svg";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import { ProductVariation } from "@/types/store";
import VariationCard from "@/common/VariationCard";
import OrderApi from "@/api/OrderApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutModal from "./LogoutModal";
import Storage from "@/utils/Storage";
import { LoadingSpinner } from "@/common/LoadingSpinner";

type AddtoCartModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  data: ProductVariation[];
  loading: boolean;
  isOpen?: boolean;
};

export default function AddtoCartModal({
  value,
  setValue,
  data,
  loading,
  isOpen,
}: AddtoCartModalProps) {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchCart = async () => {
    try {
      const cartId = await AsyncStorage.getItem("cartId");
      if (!cartId) {
        setCartItems([]);
        return;
      }
      const res = await OrderApi.getCart();
      setCartItems(res.cart.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
    }
  };

  //  Fetch cart when modal opens
  useEffect(() => {
    if (value) {
      fetchCart();
    }
  }, [value]);

  useFocusEffect(
    useCallback(() => {
      if (value) {
        fetchCart();
      }
    }, [value])
  );

  return (
    <Modal
      visible={value}
      onRequestClose={() => setValue(!value)}
      animationType="slide"
      transparent
    >
      <Pressable
        className="bg-[#2D222033]/20 z-50 flex-1 justify-end"
        onPress={() => setValue(false)}
      >
        <Pressable
          pointerEvents="box-none"
          className="bg-white rounded-tl-[8px] rounded-tr-[8px] px-[20px] py-[30px] overflow-hidden"
          onPress={() => {}}
        >
          {/* header */}
          <View className="flex-row items-center justify-between">
            <OreAppText className="text-[#424242] text-[20px] leading-[28px]">
              Available Options
            </OreAppText>
            <Pressable onPress={() => setValue(false)}>
              <CancelModalIcon />
            </Pressable>
          </View>

          <UrbanistText
            className="text-[16px] leading-[22px] text-[#424242] mt-[20px] mb-[24px]"
            style={{ fontFamily: "UrbanistSemiBold" }}
          >
            Add to cart
          </UrbanistText>

          {loading ? (
            <View className="items-center justify-center py-10">
              <LoadingSpinner />
            </View>
          ) : (
            <View style={{ maxHeight: 300 }} className="">
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={true}
                renderItem={({ item }) => (
                  <VariationCard
                    item={item}
                    cartItems={cartItems}
                    onCartUpdate={fetchCart}
                    isOpen={isOpen}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          <View className="mt-[20px] gap-[20px]">
            <Button
              title="Proceed to checkout"
              variant="outline"
              disabled={!isOpen || cartItems.length === 0}
              onPress={async () => {
                const token = await AsyncStorage.getItem("accessToken");
                if (!token) {
                  setShowLoginModal(true);
                  return;
                }

                setValue(!value);
                router.push("/Screens/Carts/CheckOut");
              }}
            />
            <Button
              title="Continue shopping"
              onPress={() => setValue(!value)}
            />
          </View>
        </Pressable>
      </Pressable>
      <LogoutModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="You need to go back log in to Proceed checkout."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["accessToken", "isGuest", "cartId"]);
          router.replace("/onboarding");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
      />
    </Modal>
  );
}

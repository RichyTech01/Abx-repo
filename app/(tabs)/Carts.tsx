import {
  View,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useCallback } from "react";
import Header from "@/common/Header";
import UrbanistText from "@/common/UrbanistText";
import CartItemCard from "@/common/CartItemCard";
import Button from "@/common/Button";
import { useRouter } from "expo-router";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import NoData from "@/common/NoData";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useCartStore } from "@/store/useCartStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutModal from "@/Modals/LogoutModal";
import Storage from "@/utils/Storage";
import ScreenWrapper from "@/common/ScreenWrapper";



export default function Carts() {
  const router = useRouter();

  const { cartItems, setCartItems } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await OrderApi.getCart();

      const items = res.cart?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setShowLoginModal(true);
        return;
      }

      //  proceed to checkout
      router.push({
        pathname: "/Screens/Carts/CheckOut",
        params: {
          cartData: JSON.stringify({
            items: cartItems,
            total: total,
          }),
        },
      });
    } catch (err) {
      console.error("Error checking token:", err);
      setShowLoginModal(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkLoginAndFetch = async () => {
        try {
          const wasLoggedIn = await AsyncStorage.getItem("accessToken");
          const cartId = await AsyncStorage.getItem("cartId");
          const guest = await AsyncStorage.getItem("isGuest");
          if ((wasLoggedIn && cartId) || (guest && cartId)) {
            fetchCart();
          } else {
            setCartItems([]);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error checking login/cart:", err);
          setCartItems([]);
          setLoading(false);
        }
      };

      checkLoginAndFetch();
    }, [])
  );

 const updateQuantity = async (
  cartItemId: number,
  action: "increase" | "decrease"
) => {
  if (updatingItems.has(cartItemId)) return;
  
  const item = cartItems.find((i) => i.id === cartItemId);
  if (!item) return;

  // ✅ Check stock before increasing
  if (action === "increase" && item.quantity >= item.item.stock) {
    showToast("info", "Out of stock. You cannot add more of this item.");
    return;
  }

  if (action === "decrease" && item.quantity <= 1) {
    showToast("info", "Remove Item Instead.");
    return;
  }

  const newQty = action === "increase" ? item.quantity + 1 : item.quantity - 1;
  const optimisticItems = cartItems.map((cartItem) => {
    if (cartItem.id === cartItemId) {
      return {
        ...cartItem,
        quantity: newQty,
        total_item_price: newQty * parseFloat(cartItem.item.price),
      };
    }
    return cartItem;
  });
  
  // Update UI instantly
  setCartItems(optimisticItems);

  // Mark as updating (prevents multiple clicks)
  setUpdatingItems((prev) => new Set(prev).add(cartItemId));

  try {
    // ✅ API call happens in background
    await OrderApi.updateCart(cartItemId, { action });
  } catch (err) {
    console.error(`Failed to ${action} quantity:`, err);
    
    // ✅ ROLLBACK on error - revert to original state
    setCartItems(cartItems);
    showToast("error", "Failed to update cart. Please try again.");
  } finally {
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  }
};

  const handleRemove = async (cartItemId: number) => {
    if (updatingItems.has(cartItemId)) return;

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await OrderApi.removeFromCart(cartItemId);

      // Update store
      const updatedItems = cartItems.filter((item) => item.id !== cartItemId);
      setCartItems(updatedItems);

      showToast("success", "Cart removed Successfully");
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(String(item.total_item_price)),
    0
  );

  return (
    <ScreenWrapper>
      <View>
        <Header title="Carts" />
      </View>

      {cartItems.length === 0 && !loading ? (
        <View className="py-[10%] justify-center items-center px-4">
          <NoData
            title="Your cart is empty"
            subtitle="Browse our products and add items to your cart."
            buttonTitle="Start Shopping"
            onButtonPress={() => router.push("/Screens/AccountScreen/AllStore")}
          />
        </View>
      ) : (
        <View
          className={`${
            Platform.OS === "ios" ? "mb-24 mt-[16px]" : "mb-32"
          }  mx-[20px] flex-1`}
        >
          {!loading && (
            <UrbanistText className="text-[#656565] text-[14px] leading-[20px] mx-auto ">
              You have {cartItems.length} items in your cart
            </UrbanistText>
          )}
          {loading ? (
            <View className="flex-1 justify-center items-center bg-[#FFF6F2] py-10 ">
              <LoadingSpinner />
            </View>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="mt-[8px]">
                  <CartItemCard
                    image={{ uri: item.item.product.prod_image_url }}
                    name={item.item.product.item_name}
                    price={`€${item.total_item_price.toFixed(2)}`}
                    quantity={item.quantity}
                    unit={
                      item.item.weight + "kg of " + item.item.product.item_name
                    }
                    onIncrease={() => updateQuantity(item.id, "increase")}
                    onDecrease={() => updateQuantity(item.id, "decrease")}
                    onRemove={() => handleRemove(item.id)}
                  />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              // refreshing={loading}
              // onRefresh={fetchCart}
            />
          )}

          {!loading && (
            <View className="bg-white px-[12px] py-[8px] rounded-[8px] mt-[8px] ">
              <UrbanistText className="text-[#656565] text-[16px] leading-[22px] font-urbanist-medium">
                Cart summary
              </UrbanistText>
              <View className="flex-row items-center justify-between mt-[4px]">
                <UrbanistText className="text-[#2D2220] text-[14px] leading-[20px] font-urbanist-semibold">
                  Total
                </UrbanistText>
                <UrbanistText className="text-[#2D2220] text-[14px] leading-[20px] font-urbanist-semibold">
                  €{total.toFixed(2)}
                </UrbanistText>
              </View>
              <UrbanistText className="text-[#7D7D7D] text-[14px] leading-[20px] font-urbanist mt-[2px]">
                Delivery fees not included yet
              </UrbanistText>

              <View className={`gap-[8px] mt-[8px]  `}>
                <Button
                  title="Continue"
                  textColor="#0C513F"
                  variant="outline"
                  borderColor="#0C513F"
                  fontClassName="urbanist-medium"
                  onPress={handleContinue}
                />
                <Button
                  title="Keep shopping"
                  borderColor="#0C513F"
                  paddingVertical={14.5}
                  fontClassName="urbanist-medium"
                  onPress={() => router.push("/Screens/AccountScreen/AllStore")}
                />
              </View>
            </View>
          )}
        </View>
      )}

      <LogoutModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="You need to go back log in to continue checkout."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["isGuest", "cartId"]);
          router.replace("/onboarding");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
      />
    </ScreenWrapper>
  );
}

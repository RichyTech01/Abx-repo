import {
  View,
  SafeAreaView,
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

export default function Carts() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await OrderApi.getCart();

      setCartItems(res.cart?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    cartItemId: number,
    action: "increase" | "decrease"
  ) => {
    if (updatingItems.has(cartItemId)) return;
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;

    // ✅ Check stock before increasing
    if (action === "increase" && item.quantity >= item.item.stock) {
      showToast("info", "Out of stock You cannot add more of this item.");
      return;
    }

    if (action === "decrease" && item.quantity <= 1) {
      showToast("info", "Remove Item Instead.");
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await OrderApi.updateCart(cartItemId, { action });
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            const newQty =
              action === "increase" ? item.quantity + 1 : item.quantity - 1;
            return {
              ...item,
              quantity: newQty,
              total_item_price: newQty * parseFloat(item.item.price),
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error(`Failed to ${action} quantity:`, err);
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
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
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
    (acc, item) => acc + parseFloat(item.total_item_price),
    0
  );

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Header title="Carts" />
      </View>

      {cartItems.length === 0 && !loading ? (
        <View className="flex-1 justify-center items-center px-4">
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
              refreshing={loading}
              onRefresh={fetchCart}
            />
          )}

          {!loading && (
            <View className="bg-white px-[12px] py-[8px] rounded-[8px] mt-[8px]">
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

              <View className="gap-[8px] mt-[8px]">
                <Button
                  title="Continue"
                  textColor="#0C513F"
                  variant="outline"
                  borderColor="#0C513F"
                  fontClassName="urbanist-medium"
                  onPress={() => {
                    router.push({
                      pathname: "/Screens/Carts/CheckOut",
                      params: {
                        cartData: JSON.stringify({
                          items: cartItems,
                          total: total,
                        }),
                      },
                    });
                  }}
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
    </SafeAreaView>
  );
}

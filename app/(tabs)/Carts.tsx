import { View, SafeAreaView, FlatList, Platform } from "react-native";
import React, { useState } from "react";
import Header from "@/common/Header";
import UrbanistText from "@/common/UrbanistText";
import CartItemCard from "@/common/CartItemCard";

const CartImg = require("@/assets/Images/Frame 1000008001.png");

const dummyCartData = [
  {
    id: "1",
    name: "Fresh tomatoes",
    price: "€30.00",
    unit: "1kg of tomatoes",
    image: CartImg,
  },
  {
    id: "2",
    name: "Golden apples",
    price: "€18.50",
    unit: "2kg pack",
    image: CartImg,
  },
  {
    id: "3",
    name: "Green peppers",
    price: "€12.00",
    unit: "500g bag",
    image: CartImg,
  },
];

export default function Carts() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    "1": 1,
    "2": 1,
    "3": 1,
  });

  const handleIncrease = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  const handleRemove = (id: string) => {
    setQuantities((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const cartItems = dummyCartData.filter(
    (item) => quantities[item.id] !== undefined
  );

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <Header title="Carts" />

      <View
        className={`${
          Platform.OS === "ios" ? "mb-24" : "mb-32"
        } mt-[16px] mx-[20px] flex-1  `}
      >
        <UrbanistText className="text-[#656565] text-[14px] leading-[20px] mx-auto">
          You have {cartItems.length} items in your cart
        </UrbanistText>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mt-[8px]">
              <CartItemCard
                image={item.image}
                name={item.name}
                price={item.price}
                unit={item.unit}
                quantity={quantities[item.id]}
                onIncrease={() => handleIncrease(item.id)}
                onDecrease={() => handleDecrease(item.id)}
                onRemove={() => handleRemove(item.id)}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

        <View className="bg-white px-[12px] py-[8px] rounded-[8px] mt-[8px]   ">
          <View className="py-[4px]  gap-[#7D7D7D]  ">
            <UrbanistText className="text-[#656565] text-[16px] leading-[22px] font-urbanist-medium    ">
              Cart summary
            </UrbanistText>
            <View className="flex-row items-center justify-between  ">
               <UrbanistText className="text-[#2D2220] text-[14px] leading-[20px] font-urbanist-semibold ">Total</UrbanistText>
               <UrbanistText className="text-[#2D2220] text-[14px] leading-[20px] font-urbanist-semibold ">€300.00 </UrbanistText>
            </View>
               <UrbanistText className="text-[#7D7D7D] text-[14px] leading-[20px] font-urbanist ">Delivery fees not included yet</UrbanistText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

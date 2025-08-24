import React from "react";
import { SafeAreaView, FlatList, View, Platform } from "react-native";
import HeaderWithSearchInput from "@/common/HeaderWithSearchInput";
import CategoryProduct from "@/common/CategoryProduct";
import CategoryImg from "@/assets/svgs/CategoryProduct.svg";

export default function CategoryDetails() {
  const products = [
    {
      id: "1",
      name: "Onion",
      price: "€14.99 - €19.99",
      rating: 4.5,
      sizes: 4,
      image: <CategoryImg />,
    },
    {
      id: "2",
      name: "Fresh Apples",
      price: "€4.99 / kg",
      rating: 4,
      sizes: 2,
      image: <CategoryImg />,
    },
    {
      id: "3",
      name: "Organic Bananas",
      price: "€3.50 / bunch",
      rating: 5,
      sizes: 3,
      image: <CategoryImg />,
    },
    {
      id: "4",
      name: "Tomatoes",
      price: "€2.99 / 500g",
      rating: 3,
      sizes: 2,
      image: <CategoryImg />,
    },
    {
      id: "5",
      name: "Carrots",
      price: "€2.49 / kg",
      rating: 4,
      sizes: 3,
      image: <CategoryImg />,
    },
    {
      id: "6",
      name: "Cabbage",
      price: "€3.20 each",
      rating: 5,
      sizes: 2,
      image: <CategoryImg />,
    },
    {
      id: "7",
      name: "Strawberries",
      price: "€5.50 / 250g",
      rating: 4,
      sizes: 2,
      image: <CategoryImg />,
    },
    {
      id: "8",
      name: "Spinach",
      price: "€2.80 / bunch",
      rating: 3,
      sizes: 2,
      image: <CategoryImg />,
    },
    {
      id: "9",
      name: "Potatoes",
      price: "€6.00 / 2kg",
      rating: 5,
      sizes: 3,
      image: <CategoryImg />,
    },
    {
      id: "10",
      name: "Sweet Corn",
      price: "€4.50 / 4pcs",
      rating: 4,
      sizes: 2,
      image: <CategoryImg />,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]  ">
      <View className={`${Platform.OS === "android" ? "mt-[40px]" : ""}`}>
        <HeaderWithSearchInput
          label="Fresh produce"
          placeholder="Ask ABX AI or search for food items of your choice"
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          marginBottom: 16, 
        }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              marginRight: index % 2 === 0 ? 16 : 0, 
            }}
          >
            <CategoryProduct
              image={item.image}
              name={item.name}
              price={item.price}
              rating={item.rating}
              sizes={item.sizes}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

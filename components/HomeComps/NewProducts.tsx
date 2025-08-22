import { View, Text, ScrollView } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";

export default function NewProducts() {
  return (
    <View>
      <SectionHeader title="New products" onPress={() => {}} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 24,
          paddingVertical: 8,
        }}
      >
        <ProductCard
          productName="Dry Fish"
          priceRange="€14.99 - €19.99"
          saleText="Sale 50%"
          isOutOfStock={false}
          isShopOpen={true}
          rating={4.9}
          sizes={4}
          onAddToCart={() => console.log("Added to cart")}
        />
        <ProductCard
          productName="Dry Fish"
          priceRange="€14.99 - €19.99"
          saleText="Sale 50%"
          isOutOfStock={false}
          isShopOpen={true}
          rating={4.9}
          sizes={4}
          onAddToCart={() => console.log("Added to cart")}
        />
        <ProductCard
          productName="Dry Fish"
          priceRange="€14.99 - €19.99"
          saleText="Sale 50%"
          isOutOfStock={false}
          isShopOpen={true}
          rating={4.9}
          sizes={4}
          onAddToCart={() => console.log("Added to cart")}
        />
      </ScrollView>
    </View>
  );
}

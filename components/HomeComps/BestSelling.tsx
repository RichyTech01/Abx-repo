import { View, ScrollView } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";


export default function BestSelling() {
  return (
    <View>
      <SectionHeader title="Best selling products" />

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
          isOutOfStock={true}
          isShopOpen={true}
          rating={4.9}
          sizes={4}
          onAddToCart={() => console.log("Added to cart")}
        />
        <ProductCard
          productName="Dry Fish"
          priceRange="€14.99 - €19.99"
          saleText="Out of stock"
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

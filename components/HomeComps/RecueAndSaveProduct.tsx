import { View, Text, ScrollView, Platform} from "react-native";
import SectionHeader from "@/common/SectionHeader";
import ProductCard from "@/common/ProductCard";

export default function RecueAndSaveProduct() {
  return (
    <View className={`${Platform.OS === "ios"? "mb-16":"mb-20"} mb-16`}>
      <SectionHeader title="Rescue and save" onPress={() => {}} />
        <Text className="mx-[20px] text-[#2D2220] text-[10px] leading-[14px] font-urbanist ">(These are products that are near their expiration date but still edible)</Text>

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

import { View, Image, Pressable } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import AddtoCartIcon from "@/assets/svgs/AddToCartIcon.svg";
import { ProductVariation } from "@/types/store";
import { useCartStore } from "@/store/cartStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import showToast from "@/utils/showToast";

type VariationCardProps = {
  item: ProductVariation;
};

export default function VariationCard({ item }: VariationCardProps) {
  const { items, addItem, updateItem, removeItem, loading } = useCartStore();

  // 🔑 Ensure matching by product_id
  const existingItem = items.find((ci) => ci.product_id === item.id);
  const quantity = existingItem?.quantity || 0;

  const handleIncrease = async () => {
    if (loading) return;

    if (quantity >= item.stock) {
      showToast("info", "Out of stock!");
      return;
    }

    if (existingItem) {
      await updateItem(existingItem.id, "increase");
    } else {
      await AsyncStorage.getItem("cartId"); 
      await addItem({ product_id: item.id });
      showToast("success", "Product added to cart!");
    }
  };

  const handleDecrease = async () => {
    if (loading || !existingItem) return;

    if (quantity > 1) {
      await updateItem(existingItem.id, "decrease");
    } else {
      await removeItem(existingItem.id); 
      showToast("success", "Product removed from cart");
    }
  };

  return (
    <View className="border border-[#F1EAE7] rounded-[8px] px-[15px] py-[10px] flex-row items-center justify-between mb-[12px]">
      {/* Product Info */}
      <View className="flex-row items-center gap-[16px]">
        <Image
          source={{ uri: item.pd_image_url }}
          className="w-[60px] h-[52px] rounded-[4px] bg-gray-200"
        />
        <View>
          <UrbanistText className="text-[14px] leading-[20px] text-[#424242]">
            {item.weight} kg
          </UrbanistText>
          <UrbanistText
            className="text-[14px] leading-[20px] text-[#2D2220]"
            style={{ fontFamily: "UrbanistSemiBold" }}
          >
            €{item.display_price}
          </UrbanistText>
        </View>
      </View>

      {/* Cart Actions */}
      <View className="flex-row items-center">
        <Pressable
          className="w-[35px] h-[35px] rounded-[8px] bg-[#86A89F] items-center justify-center"
          onPress={handleDecrease}
        >
          <View className="bg-white h-[2px] w-[11.67px]" />
        </Pressable>

        <UrbanistText
          className="text-[#424242] text-[14px] leading-[20px] px-[10px]"
          style={{ fontFamily: "UrbanistSemiBold" }}
        >
          {quantity}
        </UrbanistText>

        <Pressable
          className="w-[35px] h-[35px] rounded-[8px] bg-[#0C513F] items-center justify-center"
          onPress={handleIncrease}
        >
          <AddtoCartIcon />
        </Pressable>
      </View>
    </View>
  );
}

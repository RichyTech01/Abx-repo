import { View, Image, Pressable, ActivityIndicator } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import AddtoCartIcon from "@/assets/svgs/AddToCartIcon.svg";
import { ProductVariation } from "@/types/store";
import { CartItem } from "@/types/carts";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useState } from "react";

type VariationCardProps = {
  item: ProductVariation;
  cartItems: CartItem[];
  isOpen?: boolean;
};

export default function VariationCard({
  item,
  cartItems,
  isOpen,
}: VariationCardProps) {
  const { updating, addToCart, updateCartQuantity, removeFromCart } =
    useCartOperations();

  // Local loading state for this specific item
  const [isLoading, setIsLoading] = useState(false);

  const existingItem = cartItems.find(
    (ci) => String(ci.item?.id) === String(item.id)
  );

  const quantity = existingItem ? existingItem.quantity : 0;

  const handleIncrease = async () => {
    setIsLoading(true);
    try {
      if (existingItem) {
        await updateCartQuantity(existingItem.id, "increase", item.id);
      } else {
        await addToCart(item.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (!existingItem) return;

    setIsLoading(true);
    try {
      if (quantity > 1) {
        await updateCartQuantity(existingItem.id, "decrease", item.id);
      } else {
        await removeFromCart(existingItem.id, item.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      className={`border border-[#F1EAE7] rounded-[8px] px-[15px] py-[10px] flex-row items-center justify-between mb-[12px] `}
    >
      <View
        className={`flex-row items-center gap-[16px] ${
          item.stock === 0 && "opacity-30"
        }`}
      >
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
      <View
        className={`flex-row items-center ${item.stock === 0 && "opacity-30"}`}
      >
        <Pressable
          className={`w-[35px] ${
            quantity === 0 || !isOpen || isLoading
              ? "bg-[#86A89F]"
              : "bg-[#0C513F]"
          } h-[35px] rounded-[8px] items-center justify-center`}
          onPress={handleDecrease}
          disabled={isLoading || quantity === 0 || item.stock === 0 || !isOpen}
        >
          <View className="bg-white h-[2px] w-[11.67px]" />
        </Pressable>

        <View className="px-[10px] min-w-[40px] items-center">
          {isLoading ? (
            <ActivityIndicator size="small" color="#0C513F" />
          ) : (
            <UrbanistText
              className="text-[#424242] text-[14px] leading-[20px]"
              style={{ fontFamily: "UrbanistSemiBold" }}
            >
              {quantity}
            </UrbanistText>
          )}
        </View>

        <Pressable
          className={`w-[35px] ${
            !isOpen || item.stock === 0 || isLoading
              ? "bg-[#86A89F]"
              : "bg-[#0C513F]"
          } h-[35px] rounded-[8px] items-center justify-center`}
          onPress={handleIncrease}
          disabled={isLoading || !isOpen || item.stock === 0}
        >
          <AddtoCartIcon />
        </Pressable>
      </View>
    </View>
  );
}

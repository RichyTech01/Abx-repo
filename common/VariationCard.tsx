import { View, Image, Pressable } from "react-native";
import { useState } from "react";
import UrbanistText from "@/common/UrbanistText";
import AddtoCartIcon from "@/assets/svgs/AddToCartIcon.svg";
import { ProductVariation } from "@/types/store";
import showToast from "@/utils/showToast";
import OrderApi from "@/api/OrderApi";
import { CartItemsType } from "@/types/carts";

type VariationCardProps = {
  item: ProductVariation;
  cartItems: CartItemsType;
  onCartUpdate: () => Promise<void>;
};

export default function VariationCard({
  item,
  cartItems,
  onCartUpdate,
}: VariationCardProps) {
  const [updating, setUpdating] = useState(false);

  const existingItem = cartItems.find(
    (ci) => String(ci.item?.id) === String(item.id)
  );

  const quantity = existingItem ? existingItem.quantity : 0;

  // console.log("VariationCard - Item.id:", item.id);
  // console.log("VariationCard - Cart items:", cartItems);
  // console.log("VariationCard - Found existingItem:", existingItem);
  // console.log("VariationCard - Quantity:", quantity);

  const handleIncrease = async () => {
    if (updating) return;

    if (quantity >= item.stock) {
      showToast("info", "Out of stock!");
      return;
    }

    setUpdating(true);

    try {
      if (existingItem) {
        // Update existing item
        await OrderApi.updateCart(existingItem.id, { action: "increase" });
      } else {
        // Add new item
        await OrderApi.addToCart({ product_id: item.id });
        showToast("success", "Product added to cart!");
      }
      // ✅ Refresh shared cart state
      await onCartUpdate();
    } catch (err) {
      console.error("Failed to increase quantity:", err);
      showToast("error", "Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (updating || !existingItem) return;

    setUpdating(true);

    try {
      if (quantity > 1) {
        await OrderApi.updateCart(existingItem.id, { action: "decrease" });
      } else {
        await OrderApi.removeFromCart(existingItem.id);
        showToast("success", "Product removed from cart");
      }
      await onCartUpdate();
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
      showToast("error", "Failed to update cart");
    } finally {
      setUpdating(false);
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
          className={`w-[35px] ${
            quantity === 0 ? "bg-[#86A89F]" : "bg-[#0C513F]"
          } h-[35px] rounded-[8px] bg-[#0C513F] items-center justify-center`}
          onPress={handleDecrease}
          disabled={updating || quantity === 0}
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
          disabled={updating}
        >
          <AddtoCartIcon />
        </Pressable>
      </View>
    </View>
  );
}

import { View, Image, Pressable } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import AddtoCartIcon from "@/assets/svgs/AddToCartIcon.svg";
import { ProductVariation } from "@/types/store";
import { CartItem } from "@/types/carts";
import { useCartOperations } from "@/hooks/useCartOperations";

type VariationCardProps = {
  item: ProductVariation;
  cartItems: CartItem[];
  onCartUpdate: () => Promise<void>;
  isOpen?: boolean;
};

export default function VariationCard({
  item,
  cartItems,
  onCartUpdate,
  isOpen,
}: VariationCardProps) {
  const { updating, addToCart, updateCartQuantity, removeFromCart } =
    useCartOperations();

  const existingItem = cartItems.find(
    (ci) => String(ci.item?.id) === String(item.id)
  );

  const quantity = existingItem ? existingItem.quantity : 0;

  const handleIncrease = async () => {
    let success = false;
    if (existingItem) {
      success = await updateCartQuantity(existingItem.id, "increase");
    } else {
      success = await addToCart(item.id);
    }

    if (success) {
      await onCartUpdate();
    }
  };

  const handleDecrease = async () => {
    if (!existingItem) return;

    let success = false;
    if (quantity > 1) {
      success = await updateCartQuantity(existingItem.id, "decrease");
    } else {
      success = await removeFromCart(existingItem.id);
    }

    if (success) {
      await onCartUpdate();
    }
  };

  return (
    <View
      className={`border border-[#F1EAE7] rounded-[8px] px-[15px] py-[10px] flex-row items-center justify-between mb-[12px] `}
    >
      <View
        className={`flex-row items-center gap-[16px]   ${
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
        className={`flex-row items-center  ${
          item.stock === 0 && "opacity-30"
        } `}
      >
        <Pressable
          className={`w-[35px] ${
            quantity === 0 || !isOpen ? "bg-[#86A89F]" : "bg-[#0C513F]"
          } h-[35px] rounded-[8px] bg-[#0C513F] items-center justify-center`}
          onPress={handleDecrease}
          disabled={updating || quantity === 0 || item.stock === 0}
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
          className={`w-[35px]  ${
            !isOpen || item.stock === 0 ? "bg-[#86A89F]" : "bg-[#0C513F]"
          } h-[35px] rounded-[8px] bg-[#0C513F] items-center justify-center`}
          onPress={handleIncrease}
          disabled={updating || !isOpen || item.stock === 0}
        >
          <AddtoCartIcon />
        </Pressable>
      </View>
    </View>
  );
}
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";

export const useCartOperations = () => {
  const [updating, setUpdating] = useState(false);
  const { setCartItems } = useCartStore();

  const refreshCartStore = async () => {
    try {
      const res = await OrderApi.getCart();
      const items = res.cart?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error("Failed to refresh cart store:", err);
    }
  };

  const addToCart = async (productId: number) => {
    if (updating) return false;
    
    setUpdating(true);
    try {
      await OrderApi.addToCart({ product_id: productId });
      await refreshCartStore();
      showToast("success", "Product added to cart!");
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showToast("error", "Failed to add to cart");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateCartQuantity = async (cartItemId: number, action: "increase" | "decrease") => {
    if (updating) return false;
    
    setUpdating(true);
    try {
      await OrderApi.updateCart(cartItemId, { action });
      await refreshCartStore();
      return true;
    } catch (err) {
      console.error(`Failed to ${action} quantity:`, err);
      showToast("error", "Failed to update cart");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (updating) return false;
    
    setUpdating(true);
    try {
      await OrderApi.removeFromCart(cartItemId);
      await refreshCartStore();
      showToast("success", "Product removed from cart");
      return true;
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      showToast("error", "Failed to remove from cart");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    refreshCartStore,
  };
};
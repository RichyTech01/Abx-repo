import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";

export const useCartOperations = () => {
  const [updating, setUpdating] = useState(false);
  const { setCartItems, cartItems } = useCartStore();

  const refreshCartStore = async () => {
    try {
      const res = await OrderApi.getCart();
      const items = res.cart?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error("Failed to refresh cart store:", err);
    }
  };

  // Optimistic update helper
  const optimisticallyUpdateQuantity = (
    productId: number,
    delta: number // +1 for increase, -1 for decrease
  ) => {
    const updatedItems = cartItems.map((item) => {
      if (String(item.item?.id) === String(productId)) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Filter out items with quantity 0
    const filtered = updatedItems.filter((item) => item.quantity > 0);
    setCartItems(filtered);
  };

  const addToCart = async (productId: number) => {
    if (updating) return false;

    setUpdating(true);

    // Optimistic: Add item immediately
    const existingItem = cartItems.find(
      (item) => String(item.item?.id) === String(productId)
    );

    if (existingItem) {
      optimisticallyUpdateQuantity(productId, 1);
    }

    try {
      await OrderApi.addToCart({ product_id: productId });
      
      refreshCartStore().catch(console.error);
      
      showToast("success", "Product added to cart!");
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // Revert optimistic update on error
      await refreshCartStore();
      showToast("error", "Failed to add to cart");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateCartQuantity = async (
    cartItemId: number,
    action: "increase" | "decrease",
    productId?: number
  ) => {
    if (updating) return false;

    setUpdating(true);

    // Optimistic update
    if (productId) {
      optimisticallyUpdateQuantity(productId, action === "increase" ? 1 : -1);
    }

    try {
      await OrderApi.updateCart(cartItemId, { action });
      
      // Background refresh (no await)
      refreshCartStore().catch(console.error);
      
      return true;
    } catch (err) {
      console.error(`Failed to ${action} quantity:`, err);
      // Revert on error
      await refreshCartStore();
      showToast("error", "Failed to update cart");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (cartItemId: number, productId?: number) => {
    if (updating) return false;

    setUpdating(true);

    // Optimistic removal
    if (productId) {
      const filtered = cartItems.filter(
        (item) => String(item.item?.id) !== String(productId)
      );
      setCartItems(filtered);
    }

    try {
      await OrderApi.removeFromCart(cartItemId);
      
      // Background refresh
      refreshCartStore().catch(console.error);
      
      showToast("success", "Product removed from cart");
      return true;
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      // Revert on error
      await refreshCartStore();
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
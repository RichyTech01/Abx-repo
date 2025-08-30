import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderApi from "@/api/OrderApi";

export function useCart() {
  const queryClient = useQueryClient();

  // Fetch cart
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await OrderApi.getCart();
      return res.cart?.items || [];
    },
  });

  // Update quantity
  const updateMutation = useMutation({
    mutationFn: ({ cartItemId, action }: { cartItemId: number; action: "increase" | "decrease" }) =>
      OrderApi.updateCart(cartItemId, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); 
    },
  });

  // Remove item
  const removeMutation = useMutation({
    mutationFn: (cartItemId: number) => OrderApi.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cartItems: data || [],
    isLoading,
    updateQuantity: updateMutation.mutate,
    removeItem: removeMutation.mutate,
  };
}

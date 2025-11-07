import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import Storage from "@/utils/Storage";
import { Shop } from "@/common/ShopCard";

interface UseFavoriteShopProps {
  shops: Shop[];
  setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
  queryKey?: string[];
  onLoginRequired?: () => void;
}

export const useFavoriteShop = ({
  shops,
  setShops,
  queryKey = ["stores"],
  onLoginRequired,
}: UseFavoriteShopProps) => {
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onMutate: async (storeId: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousShops = shops;

      // Optimistically update local state
      setShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
        )
      );

      // Return context with previous value for rollback
      return { previousShops };
    },
    onError: (error, storeId, context) => {
      // Rollback to previous state on error
      if (context?.previousShops) {
        setShops(context.previousShops);
      }
    },
    onSettled: () => {
      // Invalidate all store-related queries to sync across all screens
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] });
      queryClient.invalidateQueries({ queryKey: ["AlltopRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["AllclosestStores"] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      onLoginRequired?.();
      return;
    }

    // Call mutation
    favoriteMutation.mutate(storeId);
  };

  return {
    handleFavoritePress,
    isLoading: favoriteMutation.isPending,
  };
};
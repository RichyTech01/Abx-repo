import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import Storage from "@/utils/Storage";
import { Shop } from "@/common/ShopCard";

interface UseFavoriteShopProps {
  queryKey: (string | number)[];
  onLoginRequired?: () => void;
}

export const useFavoriteShop = ({
  queryKey,
  onLoginRequired,
}: UseFavoriteShopProps) => {
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onMutate: async (storeId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Update ALL queries that match the base key (all pages)
      const baseKey = queryKey.slice(0, 3); // Get base key without page number
      const previousData: any[] = [];

      // Update all matching queries in cache
      queryClient.setQueriesData(
        { queryKey: baseKey, exact: false },
        (oldData: any) => {
          if (!oldData) return oldData;

          previousData.push({ key: queryKey, data: oldData });

          // Handle { shops: Shop[], hasNext: boolean } structure
          if (oldData.shops && Array.isArray(oldData.shops)) {
            return {
              ...oldData,
              shops: oldData.shops.map((shop: Shop) =>
                shop.id === storeId
                  ? { ...shop, isFavorite: !shop.isFavorite }
                  : shop
              ),
            };
          }

          // Handle Shop[] structure
          if (Array.isArray(oldData)) {
            return oldData.map((shop: Shop) =>
              shop.id === storeId
                ? { ...shop, isFavorite: !shop.isFavorite }
                : shop
            );
          }

          return oldData;
        }
      );

      return { previousData };
    },
    onError: (error, storeId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate related queries to sync across screens
      queryClient.invalidateQueries({ queryKey: ["topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["ALl-topRatedStores"] });
      queryClient.invalidateQueries({ queryKey: ["closestStores"] });
      queryClient.invalidateQueries({ queryKey: ["AllclosestStores"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteStores"] });
    },
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      onLoginRequired?.();
      return;
    }

    favoriteMutation.mutate(storeId);
  };

  return {
    handleFavoritePress,
    isLoading: favoriteMutation.isPending,
  };
};
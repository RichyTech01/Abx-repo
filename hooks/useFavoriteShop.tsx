import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import Storage from "@/utils/Storage";
import { Shop } from "@/common/ShopCard";


interface UseFavoriteShopProps {
  queryKey: (string | number | null)[];
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
      // Cancel any outgoing refetches for THIS specific query
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update THIS specific query
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        // Handle useInfiniteQuery structure with pages
        if (old.pages && Array.isArray(old.pages)) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              shops: page.shops.map((shop: Shop) =>
                shop.id === storeId
                  ? { ...shop, isFavorite: !shop.isFavorite }
                  : shop
              ),
            })),
          };
        }

        // Handle { shops: Shop[], hasNext: boolean } structure
        if (old.shops && Array.isArray(old.shops)) {
          return {
            ...old,
            shops: old.shops.map((shop: Shop) =>
              shop.id === storeId
                ? { ...shop, isFavorite: !shop.isFavorite }
                : shop
            ),
          };
        }

        // Handle Shop[] structure
        if (Array.isArray(old)) {
          return old.map((shop: Shop) =>
            shop.id === storeId
              ? { ...shop, isFavorite: !shop.isFavorite }
              : shop
          );
        }

        return old;
      });

      return { previousData };
    },
    onError: (error, storeId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Get the current query base key to exclude it from invalidation
      const currentBaseKey = queryKey[0];

      // Invalidate all other favorite-related queries EXCEPT the current one
      const queriesToInvalidate = [
        "topRatedStores",
        "ALl-topRatedStores",
        "closestStores",
        "AllClosestStores",
        "favoriteStores",
        "allStores",
      ].filter((key) => key !== currentBaseKey);

      queriesToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
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

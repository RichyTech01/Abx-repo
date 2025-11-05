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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      onLoginRequired?.();
      return;
    }

    // Optimistic UI update
    const prevShops = shops;
    setShops((prevShops) =>
      prevShops.map((shop) =>
        shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
      )
    );

    // Call API
    favoriteMutation.mutate(storeId, {
      onError: () => {
        // Rollback on error
        setShops(prevShops);
      },
    });
  };

  return {
    handleFavoritePress,
    isLoading: favoriteMutation.isPending,
  };
};


import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import StoreApi from "@/api/StoreApi";
import UrbanistText from "@/common/UrbanistText";
import { useLocationStore } from "@/store/locationStore";
import ShopCard, { Shop } from "@/common/ShopCard";
import CategoryProduct from "@/common/CategoryProduct";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { isStoreOpen } from "@/utils/storeStatus";
import Storage from "@/utils/Storage";
import LogoutModal from "@/Modals/LogoutModal";
import AddtoCartModal from "@/Modals/AddtoCartModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "@/common/ScreenWrapper";
import Backarrow from "@/assets/svgs/BackArrow.svg";
import { getDistanceInKm } from "@/utils/getDistanceInKm";

export default function SearchScreen() {
  const { latitude, longitude } = useLocationStore();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const searchParam = params.search as string | undefined;

  const [query, setQuery] = useState(searchParam || "");
  const [stores, setStores] = useState<Shop[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);
  const router = useRouter();

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["searchStores"] }),
  });

  // Calculate distance for a product
  const calculateDistance = useCallback(
    (product: any): number => {
      if (
        latitude == null ||
        longitude == null ||
        !product.store?.store_address?.location?.coordinates
      ) {
        return 0;
      }

      const storeLon = product.store.store_address.location.coordinates[0];
      const storeLat = product.store.store_address.location.coordinates[1];

      return getDistanceInKm(latitude, longitude, storeLat, storeLon);
    },
    [latitude, longitude]
  );

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);

      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }

      const res = await StoreApi.searchMarketplace(
        searchTerm,
        latitude,
        longitude
      );

      // Map stores to Shop format
      // Matches by business name or postal code
      const storeResults: Shop[] = (res.stores || []).map((store: any) => ({
        id: store.id.toString(),
        name: store.business_name,
        image:
          store.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        store_open: store.open_time,
        store_close: store.close_time,
        isFavorite: store.is_favorited ?? false,
        rating: store.store_rating,
        distance: store.distance_km
          ? `${parseFloat(store.distance_km).toFixed(1)}`
          : "N/A",
      }));

      // Products matched by name
      const productResults = res.products || [];

      setStores(storeResults);
      setProducts(productResults);
    } catch (error) {
      console.error("Search error:", error);
      setStores([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search from query parameter
  useEffect(() => {
    if (searchParam && searchParam.trim()) {
      setQuery(searchParam);
      handleSearch(searchParam);
    }
  }, [searchParam]);

  const handleFavoritePress = async (storeId: string) => {
    const token = await Storage.get("accessToken");
    if (!token) {
      setLoginVisible(true);
      return;
    }

    // Optimistic UI update
    const prevStores = stores;
    setStores((prevStores) =>
      prevStores.map((shop) =>
        shop.id === storeId ? { ...shop, isFavorite: !shop.isFavorite } : shop
      )
    );

    // Call API
    favoriteMutation.mutate(storeId, {
      onError: () => {
        // Rollback on error
        setStores(prevStores);
      },
    });
  };

  const handleAddToCart = async (id: number) => {
    setModalVisible(true);
    setProductLoading(true);
    try {
      const product = await StoreApi.getProduct(id);
      setProductDetails(product);
    } catch (err) {
      console.error("Failed to fetch product details", err);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* Header with Back Button and Search */}
      <View className="px-5 py-3 border-b border-[#F1EAE7]">
        <View className="flex-row items-center gap-3 mb-3">
          <TouchableOpacity
            className="w-[24px] h-[24px] items-start justify-center "
            onPress={() => router.back()}
          >
            <Backarrow />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-[#f2f2f2] rounded-[10px] px-4 py-3 border border-[#D7D7D7]">
            <TextInput
              className="flex-1 ml-2 text-[14px] text-black font-urbanist"
              placeholder="Search for stores or products..."
              placeholderTextColor="#656565"
              value={query}
              onChangeText={setQuery}
              selectionColor="#036047"
              autoFocus={!searchParam}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch()}
            />
          </View>
        </View>
      </View>

      {/* Results */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <LoadingSpinner />
            <UrbanistText className="text-[14px] text-[#656565] mt-4">
              Searching...
            </UrbanistText>
          </View>
        ) : hasSearched ? (
          <View style={{ paddingBottom: Platform.OS === "ios" ? 20 : 40 }}>
            {/* Stores Section */}
            {stores.length > 0 && (
              <View className="mb-6 mx-[20px] mt-[15px]">
                <UrbanistText className="text-[18px] font-bold text-[#121212] mb-4">
                  Stores ({stores.length})
                </UrbanistText>
                <UrbanistText className="text-[12px] text-[#656565] mb-3">
                  Matched by business name or postal code
                </UrbanistText>
                <View style={{ gap: 24 }}>
                  {stores.map((shop) => (
                    <ShopCard
                      key={`store-${shop.id}`}
                      shop={shop}
                      onFavoritePress={() => handleFavoritePress(shop.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <View className="mb-6">
                <UrbanistText className="text-[18px] font-bold text-[#121212] mb-4 mx-[20px]">
                  Products ({products.length})
                </UrbanistText>
                <UrbanistText className="text-[12px] text-[#656565] mb-3 mx-[20px]">
                  Matched by product name
                </UrbanistText>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingHorizontal: SCREEN_PADDING,
                    gap: GAP,
                  }}
                >
                  {products.map((item) => {
                    const distance = calculateDistance(item);

                    return (
                      <View
                        key={`product-${item.id}`}
                        style={{ width: ITEM_WIDTH }}
                      >
                        <CategoryProduct
                          image={{ uri: item.prod_image_url }}
                          name={item.item_name}
                          price={`€${item.min_price} - €${item.max_price}`}
                          rating={2}
                          distance={parseFloat(distance.toFixed(1))}
                          onPress={() =>
                            router.push({
                              pathname: "/Screens/HomeScreen/ProductDetails",
                              params: { id: item.id },
                            })
                          }
                          onAddToCart={() => handleAddToCart(item.id)}
                          isOutOfStock={
                            item.variations?.[0]?.stock === 0 ||
                            !item.variations?.length
                          }
                          isOpen={
                            item.store
                              ? isStoreOpen(
                                  item.store.open_time,
                                  item.store.close_time
                                )
                              : false
                          }
                          discountPercent={
                            Number(item.variations?.[0]?.discount_per) || 0
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* No Results */}
            {stores.length === 0 && products.length === 0 && (
              <View className="py-20 items-center px-10">
                <UrbanistText className="text-[16px] text-[#656565] text-center">
                  No stores or products found for "{query}"
                </UrbanistText>
                <UrbanistText className="text-[12px] text-[#999] text-center mt-2">
                  Try searching by store name, postal code, or product name
                </UrbanistText>
              </View>
            )}
          </View>
        ) : (
          <View className="py-20 items-center px-10">
            <UrbanistText className="text-[16px] text-[#656565] text-center">
              Enter a search term and tap "Search" to find stores and products
            </UrbanistText>
            <UrbanistText className="text-[12px] text-[#999] text-center mt-2">
              Search by store name, postal code, or product name
            </UrbanistText>
          </View>
        )}
      </ScrollView>

      {/* Login Modal */}
      <LogoutModal
        title="Login Required"
        message="You need to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["isGuest", "cartId"]);
          router.replace("/Login");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />

      {/* Add to Cart Modal */}
      <AddtoCartModal
        value={modalVisible}
        setValue={setModalVisible}
        loading={productLoading}
        data={productDetails?.variations ?? []}
        isOpen={
          productDetails
            ? isStoreOpen(
                productDetails.store.open_time,
                productDetails.store.close_time
              )
            : false
        }
      />
    </ScreenWrapper>
  );
}

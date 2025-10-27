import { View, FlatList, Text, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import { useRouter } from "expo-router";
import ShopCard from "@/common/ShopCard";
import { useClosestStores } from "@/hooks/useClosestStores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoreApi from "@/api/StoreApi";
import LogoutModal from "@/Modals/LogoutModal";
import Storage from "@/utils/Storage";

type Props = {
  refreshTrigger: boolean;
};

export default function ClosestShops({ refreshTrigger }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loginVisible, setLoginVisible] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const {
    data: shops,
    isLoading,
    isError,
    refetch,
    locationStatus,
    locationError,
  } = useClosestStores();

  const favoriteMutation = useMutation({
    mutationFn: (storeId: string) => StoreApi.toggleFavorite(Number(storeId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["closestStores"] }),
  });

  useEffect(() => {
    if (locationStatus === "success") {
      refetch();
    }
  }, [refreshTrigger]);

  const SkeletonCard = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={{
          opacity,
          width: 254,
          height: 180,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 120,
            backgroundColor: "#C4D1DA",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              width: "70%",
              height: 16,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: "50%",
              height: 12,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
            }}
          />
        </View>
      </Animated.View>
    );
  };

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => <SkeletonCard />}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 24,
        paddingVertical: 8,
      }}
    />
  );

  const renderItem = ({ item }: { item: any }) => (
    <ShopCard
      shop={{
        id: item.id.toString(),
        name: item.business_name,
        image:
          item.store_img ||
          "https://lon1.digitaloceanspaces.com/abx-file-space/category/africanFoods.webp",
        distance: item.distance_km 
          ? `${parseFloat(item.distance_km).toFixed(1)}` 
          : "N/A",
        rating: item.rating || 0,
        isFavorite: item.is_favorited ?? false,
        category: item.category || "General",
        store_open: item.open_time,
        store_close: item.close_time,
      }}
      width={254}
      onFavoritePress={async () => {
        const token = await Storage.get("accessToken");
        if (!token) {
          setLoginVisible(true);
          return;
        }
        favoriteMutation.mutate(item.id);
      }}
    />
  );

  const ListEmptyComponent = () => (
    <Text className="mx-auto py-8">No nearby stores found.</Text>
  );

  const ErrorComponent = ({ message }: { message: string }) => (
    <Text className="mx-auto py-8 text-red-500">{message}</Text>
  );

  let content;
  if (locationStatus === "pending" || isLoading) {
    content = renderSkeletons();
  } else if (locationStatus === "error") {
    content = (
      <ErrorComponent
        message={locationError || "Location permission denied."}
      />
    );
  } else if (isError) {
    content = <ErrorComponent message="Failed to fetch nearest stores." />;
  } else {
    content = (
      <FlatList
        data={shops || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 24,
          paddingVertical: 8,
        }}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  }

  return (
    <View>
      <SectionHeader
        title="Closest shops"
        onPress={() => router.push("/Screens/HomeScreen/AllClosestShops")}
      />
      {content}

      <LogoutModal
        title="Login Required"
        message="Sorry! you need to go back to log in to favorite a shop."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove([ "isGuest", "cartId"]);
          router.replace("/Login");
        }}
        confirmButtonColor="#0C513F"
        cancelButtonColor="#F04438"
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />
    </View>
  );
}
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import NotificationIcon from "@/assets/svgs/NotificationIcon";
import MaincartIcon from "@/assets/svgs/MaincartIcon";
import Welcomebanner from "@/assets/svgs/Welcomebanner";
import SearchInput from "@/common/SearchInput";

import Categories from "@/components/HomeComps/Categories";
import TopratedShops from "@/components/HomeComps/TopratedShops";
import ClosestShops from "@/components/HomeComps/ClosestShops";
import NewProducts from "@/components/HomeComps/NewProducts";
import BestSelling from "@/components/HomeComps/BestSelling";
import SpendingLimit from "@/components/HomeComps/SpendingLimit";
import RescueAndSave from "@/components/HomeComps/RescueAndSave";
import RecueAndSaveProduct from "@/components/HomeComps/RecueAndSaveProduct";
import { useUserStore } from "@/store/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useCartStore } from "@/store/useCartStore";
import OrderApi from "@/api/OrderApi";
import NotificationBadge from "@/common/NotificationBadge";
import ScreenWrapper from "@/common/ScreenWrapper";

const { width } = Dimensions.get("window");

const banners = [
  <Welcomebanner key="banner-1" />,
  <Welcomebanner key="banner-2" />,
];

const loopedBanners = [...banners, ...banners];

function BannerSlider() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(banners.length);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({
      offset: currentIndex * width,
      animated: false,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);

      if (nextIndex >= loopedBanners.length - 1) {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: banners.length * width,
            animated: false,
          });
          setCurrentIndex(banners.length);
        }, 1000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, banners, loopedBanners, width]);

  return (
    <FlatList
      ref={flatListRef}
      data={loopedBanners}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item}
        </View>
      )}
      onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
      }}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const { user, loading, fetchUser } = useUserStore();
  const { unreadCount, checkNotificationStatus } = useNotificationStore();
  const { cartItems, setCartItems } = useCartStore();

  const handleNotificationPress = () => {
    router.push("/Screens/HomeScreen/NotificationScreen");
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  // Check notification status on focus
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const access = await AsyncStorage.getItem("accessToken");
        // await fetchCartCount();
        if (!access) return;

        checkNotificationStatus();
        await fetchCartCount();
      };

      const fetchCartCount = async () => {
        try {
          const res = await OrderApi.getCart();
          const items = res.cart?.items || [];
          const cartId = res.cart?.id;

          if (cartId) {
            await AsyncStorage.setItem("cartId", cartId);
          } else {
            await AsyncStorage.removeItem("cartId");
          }

          setCartItems(items);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      };

      init();
    }, [checkNotificationStatus, setCartItems])
  );

  return (
    <ScreenWrapper>
      <View className="mx-[20px] flex-row items-center justify-between mt-2">
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-[20px] text-[#2D2220] leading-[28px] font-orelega">
            Welcome, {user?.first_name || "Guest"}!
          </Text>
        )}

        <View className="flex-row items-center gap-[20px]">
          <Pressable onPress={handleNotificationPress}>
            <NotificationBadge count={unreadCount}>
              <NotificationIcon />
            </NotificationBadge>
          </Pressable>
          <Pressable
            className="bg-[#F9DAA8] h-[35px] w-[35px] rounded-full items-center justify-center"
            onPress={() => router.push("/Carts")}
          >
            <NotificationBadge count={cartItems.length}>
              <MaincartIcon />
            </NotificationBadge>
          </Pressable>
        </View>
      </View>

      {/* Search input */}
      <View className="mx-[20px] mt-[24px]">
        <SearchInput placeholder="Search for food items of your choice" />
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Auto sliding banners */}
        <View className="mt-[32px]">
          <BannerSlider />
        </View>

        {/* Sections */}
        <View className="mt-[24px] gap-[24px]">
          <Categories />
          <TopratedShops />
          <ClosestShops />
          <RescueAndSave />
          <NewProducts />
          <BestSelling />
          <SpendingLimit />
          <RecueAndSaveProduct />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

import {
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
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
import { useNotificationStore } from "@/store/useNotificationStore";
import { useCartStore } from "@/store/useCartStore";
import NotificationApi from "@/api/NotificationApi";
import OrderApi from "@/api/OrderApi";
import NotificationBadge from "@/common/NotificationBadge";

export default function Home() {
  const router = useRouter();
  const { user, loading, fetchUser } = useUserStore();
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const { cartItems, setCartItems } = useCartStore();

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const data = await NotificationApi.getNotifications(1);
      const notifications = data.results || [];
      const unread = notifications.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  // Fetch cart items count
  const fetchCartCount = async () => {
    try {
      const res = await OrderApi.getCart();
      const items = res.cart?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
      fetchCartCount();
    }, [])
  );

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <View
        className="mx-[20px] flex-row items-center justify-between mt-2"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-[20px] text-[#2D2220] leading-[28px] font-orelega">
            Welcome, {user?.first_name || "User"}!
          </Text>
        )}

        <View className="flex-row items-center gap-[20px]">
          <Pressable
            onPress={() =>
              router.push("/Screens/HomeScreen/NotificationScreen")
            }
          >
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
        <SearchInput placeholder="Ask ABX AI or search for food items of your choice" />
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Welcome banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-[32px] pl-[20px]"
          contentContainerStyle={{ gap: 12 }}
        >
          <Welcomebanner />
          <Welcomebanner />
        </ScrollView>

        {/* Sections */}
        <View className="mt-[24px] gap-[24px] ">
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
    </SafeAreaView>
  );
}
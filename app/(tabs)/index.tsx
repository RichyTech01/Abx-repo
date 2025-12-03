import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import NotificationIcon from "@/assets/svgs/NotificationIcon";
import MaincartIcon from "@/assets/svgs/MaincartIcon";
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
import { useLocationStore } from "@/store/locationStore";
import NotificationBadge from "@/common/NotificationBadge";
import ScreenWrapper from "@/common/ScreenWrapper";

const { width } = Dimensions.get("window");

const banners = [
  require("@/assets/Images/FirstHomeImage.png"),
  require("@/assets/Images/SecondHomeImage.png"),
];

const loopedBanners = [banners[banners.length - 1], ...banners, banners[0]];

function BannerSlider() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollTimer.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 4000);

    return () => {
      if (scrollTimer.current) {
        clearInterval(scrollTimer.current);
      }
    };
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={banners}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => `banner-${index}`}
      renderItem={({ item }) => (
        <View style={{ width }}>
          <Image
            source={item}
            resizeMode="cover"
            style={{
              width: width * 0.9,
              height: 180,
              borderRadius: 20,
              marginHorizontal: width * 0.05,
            }}
          />
        </View>
      )}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={3}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUserStore();
  const { unreadCount, checkNotificationStatus } = useNotificationStore();
  const { cartItems, refreshCart } = useCartStore();
  const { requestLocation } = useLocationStore();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNotificationPress = () => {
    router.push("/Screens/HomeScreen/NotificationScreen");
  };

  useEffect(() => {
    const STALE_TIME = 5 * 60 * 1000; // 5 minutes

    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const now = Date.now();

        // CART
        const lastCartFetch = await AsyncStorage.getItem(
          `cartTimestamp_${token}`
        );
        if (!lastCartFetch || now - Number(lastCartFetch) > STALE_TIME) {
          await refreshCart();
          console.log("carts");
          if (token) {
            await AsyncStorage.setItem(
              `cartTimestamp_${token}`,
              now.toString()
            );
          }
        }

        // NOTIFICATIONS
        if (token && token !== "null") {
          const lastNotifFetch = await AsyncStorage.getItem(
            `notifTimestamp_${token}`
          );
          if (!lastNotifFetch || now - Number(lastNotifFetch) > STALE_TIME) {
            await checkNotificationStatus();
            console.log("nots");

            await AsyncStorage.setItem(
              `notifTimestamp_${token}`,
              now.toString()
            );
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    init();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const now = Date.now();
      const STALE_TIME = 5 * 60 * 1000;

      await requestLocation();

      const lastCartFetch = await AsyncStorage.getItem(
        `cartTimestamp_${token}`
      );
      const lastCartError = await AsyncStorage.getItem(`cartError_${token}`);

      if (
        !lastCartFetch ||
        now - Number(lastCartFetch) > STALE_TIME ||
        lastCartError === "true"
      ) {
        try {
          await refreshCart();
          await AsyncStorage.setItem(`cartTimestamp_${token}`, now.toString());
          await AsyncStorage.setItem(`cartError_${token}`, "false");
        } catch (err) {
          await AsyncStorage.setItem(`cartError_${token}`, "true");
        }
      }

      // NOTIFICATIONS — only fetch if stale or if previous fetch failed
      if (token && token !== "null") {
        const lastNotifFetch = await AsyncStorage.getItem(
          `notifTimestamp_${token}`
        );
        const lastNotifError = await AsyncStorage.getItem(
          `notifError_${token}`
        );

        if (
          !lastNotifFetch ||
          now - Number(lastNotifFetch) > STALE_TIME ||
          lastNotifError === "true"
        ) {
          try {
            await checkNotificationStatus();
            await AsyncStorage.setItem(
              `notifTimestamp_${token}`,
              now.toString()
            );
            await AsyncStorage.setItem(`notifError_${token}`, "false");
          } catch (err) {
            await AsyncStorage.setItem(`notifError_${token}`, "true");
          }
        }
      }
    } catch (err) {
      console.log("Refresh error:", err);
    }

    setRefreshing(false);
  }, [requestLocation, refreshCart]);

  return (
    <ScreenWrapper>
      <View className="mx-[20px] flex-row items-center justify-between mt-2">
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-[20px] text-[#2D2220] leading-[28px] font-orelega ">
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
        <SearchInput />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mt-[32px]">
          <BannerSlider />
        </View>

        {/* Sections */}
        <View className="mt-[24px] gap-[24px]">
          <Categories refreshTrigger={refreshTrigger} />
          <TopratedShops refreshTrigger={refreshTrigger} />
          <ClosestShops refreshTrigger={refreshTrigger} />
          <RescueAndSave />
          <NewProducts refreshTrigger={refreshTrigger} />
          <BestSelling refreshTrigger={refreshTrigger} />
          <SpendingLimit />
          <RecueAndSaveProduct refreshTrigger={refreshTrigger} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

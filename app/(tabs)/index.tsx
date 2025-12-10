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
import { useNotificationStore } from "@/store/useNotificationStore";
import { useCartStore } from "@/store/useCartStore";
import { useLocationStore } from "@/store/locationStore";
import NotificationBadge from "@/common/NotificationBadge";
import ScreenWrapper from "@/common/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const banners = [
  require("@/assets/Images/FirstHomeImage.png"),
  require("@/assets/Images/SecondHomeImage.png"),
];

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
  const { user, loading, fetchUser } = useUserStore();
  const { unreadCount, hasNewNotifications, checkNotificationStatus } =
    useNotificationStore();
  const { cartItems, refreshCart } = useCartStore();
  const { requestLocation } = useLocationStore();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const initialize = async () => {
      try {
        const access = await AsyncStorage.getItem("accessToken");

        if (!user) await fetchUser();

        await refreshCart();

        if (access) {
          await checkNotificationStatus();
        }

        hasInitialized.current = true;
      } catch (err) {
        console.error("❌ Initialization error:", err);
      }
    };

    initialize();
  }, [user, fetchUser, refreshCart, checkNotificationStatus]);

  useEffect(() => {
    if (hasNewNotifications) {
      console.log("📬 New notification, refreshing count...");
      checkNotificationStatus();
    }
  }, [hasNewNotifications, checkNotificationStatus]);

  const handleNotificationPress = () => {
    router.push("/Screens/HomeScreen/NotificationScreen");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const access = await AsyncStorage.getItem("accessToken");

      await requestLocation();
      await refreshCart();
      if (access) {
        await checkNotificationStatus();
      }

      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Refresh error:", err);
    }

    setRefreshing(false);
  }, [requestLocation, refreshCart, checkNotificationStatus]);

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

import { View, Text, Pressable, FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "@/common/Header";
import ScreenWrapper from "@/common/ScreenWrapper";
import MarkIcon from "@/assets/svgs/MarkIcon.svg";
import Notificationcard from "@/common/Notificationcard";
import NotificationApi from "@/api/NotificationApi";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import NoData from "@/common/NoData";
import { useRouter } from "expo-router";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/NotificationType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationScreen() {
  const { user, fetchUser } = useUserStore();
  const { setHasNewNotifications } = useNotificationStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationApi.getNotifications(1);
      setNotifications(data.results || []);

      // Update notification status
      const hasUnread = data.results?.some((n: any) => !n.is_read) || false;
      setHasNewNotifications(hasUnread);
    } catch (err) {
      console.error("❌ Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const unread = notifications.filter((n) => !n.is_read);

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.is_read);

      if (unread.length === 0) {
        showToast("info", "📭 All notifications are already read");
        return;
      }

      await Promise.all(
        unread.map((n) =>
          NotificationApi.markAsReadPartial(n.id, {
            title: n.title,
            message: n.message,
            notification_type: n.notification_type,
            data: n.data,
          })
        )
      );

      fetchNotifications();
      // Update the dot indicator
      setHasNewNotifications(false);
    } catch (err) {
      console.error("❌ Error marking all as read", err);
    }
  };

  // Fetch notifications when screen comes into focus
  // Fetch notifications only if logged in
  const checkLoginAndFetch = async () => {
    const wasLoggedIn = await AsyncStorage.getItem("accessToken");
    console.log("🔑 Token:", wasLoggedIn);

    if (wasLoggedIn) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  };

  // Run on screen focus
  useFocusEffect(
    useCallback(() => {
      checkLoginAndFetch();
    }, [])
  );

  // Run on initial mount
  useEffect(() => {
    checkLoginAndFetch();
  }, []);

  return (
    <ScreenWrapper>
      <Header title="Notifications" />

      <View className="mt-[22px]">
        {notifications.length > 0 && (
          <Pressable
            onPress={handleMarkAllAsRead}
            className="items-center mx-[20px] flex-row justify-end"
            disabled={unread.length === 0}
          >
            <MarkIcon />
            <Text
              style={{ fontFamily: "InterRegular" }}
              className="text-[14px] leading-[20px] text-[#05A85A] ml-[4px]"
            >
              Mark all as read
            </Text>
          </Pressable>
        )}

        <View className="mx-[20px] mt-[16px] h-screen">
          {loading ? (
            <LoadingSpinner />
          ) : notifications.length === 0 ? (
            <NoData
              title="No notifications"
              subtitle="We will keep you updated when you have a notification. "
              buttonTitle="Explore ABX stores"
              onButtonPress={() =>
                router.push("/Screens/AccountScreen/AllStore")
              }
            />
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Notificationcard
                  title={item.title}
                  message={item.message}
                  date={new Date(item.created_at).toDateString()}
                  isRead={item.is_read}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

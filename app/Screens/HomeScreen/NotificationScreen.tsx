import { useState } from "react";
import NotificationApi from "@/api/NotificationApi";
import MarkIcon from "@/assets/svgs/MarkIcon.svg";
import Header from "@/common/Header";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import NoData from "@/common/NoData";
import Notificationcard from "@/common/Notificationcard";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useUserStore } from "@/store/useUserStore";
import type { Notification } from "@/types/NotificationType";
import MQTTClient from "@/utils/mqttClient";
import showToast from "@/utils/showToast";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Storage from "@/utils/Storage";

export default function NotificationScreen() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const { user, fetchUser } = useUserStore();
  const {
    notifications,
    loading,
    loadingMore,
    hasMore,
    fetchNotifications,
    fetchMoreNotifications,
    markAllAsRead,
    markNotificationAsRead,
    handleRealtimeNotification,
    checkNotificationStatus,
  } = useNotificationStore();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await Storage.get("accessToken");
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (hasToken && !user) {
      fetchUser();
      fetchNotifications();
    }
  }, [hasToken, user, fetchUser, fetchNotifications]);

  useEffect(() => {
    if (user?.id && MQTTClient.isClientConnected()) {
      const originalCallback = MQTTClient.getMessageCallback();

      const combinedCallback = (notification: Notification) => {
        if (originalCallback) {
          originalCallback(notification);
        }
        handleRealtimeNotification(notification);
      };

      // Update MQTT callback
      MQTTClient.updateCallback(combinedCallback);
    }

    return () => {
      console.log("Cleaning up notification screen MQTT listener");
    };
  }, [user?.id, handleRealtimeNotification]);

  const unread = notifications.filter((n) => !n.is_read);

  // Handle individual notification click
  const handleNotificationClick = async (notification: Notification) => {
    // 1. If not read, mark it as read
    if (!notification.is_read) {
      try {
        await NotificationApi.markAsReadPartial(notification.id, {
          title: notification.title,
          message: notification.message,
          notification_type: notification.notification_type,
          data: notification.data,
        });

        // Update local state
        markNotificationAsRead(Number(notification.id));
        checkNotificationStatus();
        console.log(`Marked notification ${notification.id} as read`);
      } catch (err) {
        console.error("Error marking notification as read", err);
        showToast("error", "Failed to mark notification as read");
      }
    }

    router.push({
      pathname: "/Screens/OrderScreen/OrderDetailsScrenn",
      params: { id: notification.data.order_id },
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);

      if (unreadNotifications.length === 0) {
        showToast("info", "All notifications are already read");
        return;
      }

      await Promise.all(
        unreadNotifications.map((n) =>
          NotificationApi.markAsReadPartial(n.id, {
            title: n.title,
            message: n.message,
            notification_type: n.notification_type,
            data: n.data,
          })
        )
      );

      // Update store
      markAllAsRead();
      showToast(
        "success",
        `Marked ${unreadNotifications.length} notifications as read`
      );
    } catch (err) {
      console.error("Error marking all as read", err);
      showToast("error", "Failed to mark notifications as read");
    }
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && hasToken) {
      fetchMoreNotifications();
    }
  }, [hasMore, loadingMore, fetchMoreNotifications]);

 
  const renderFooter = () => {
    if (!loadingMore || !hasToken) return null;

    return (
      <View className="py-4 items-center">
        <LoadingSpinner />
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Notifications" />

      <View className="mt-[22px]">
        {notifications.length > 0 && unread.length > 0 && (
          <Pressable
            onPress={handleMarkAllAsRead}
            className="items-center mx-[20px] flex-row justify-end"
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
          ) : (
            <FlatList
              data={notifications}
              contentContainerStyle={{ paddingBottom: 210 }}
              keyExtractor={(item, index) =>
                item.id !== undefined
                  ? item.id.toString()
                  : Math.random().toString()
              }
              renderItem={({ item }) => (
                <Notificationcard
                  title={item.title}
                  message={item.message}
                  date={new Date(item.created_at ?? "").toDateString()}
                  isRead={item.is_read}
                  onPress={() => handleNotificationClick(item)}
                />
              )}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                <View className="py-10 mx-auto text-[16px] ">
                  <NoData
                    title="No notifications"
                    subtitle="We will keep you updated when you have a notification. "
                    buttonTitle="Explore ABX stores"
                    onButtonPress={() => router.back()}
                  />
                </View>
              }
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

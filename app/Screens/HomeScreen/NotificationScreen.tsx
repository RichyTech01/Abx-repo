import { View, Text, Pressable, FlatList } from "react-native";
import { useEffect, useCallback, useState } from "react";
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
import MQTTClient from "@/utils/mqttClient";
import OrderDetails from "@/components/OrderComps/OrderDetails";

export default function NotificationScreen() {
  const { user, fetchUser } = useUserStore();
  const [NotOrderDetails, setNotOrderDetails] = useState();
  const {
    notifications,
    loading,
    hasNewNotifications,
    fetchNotifications,
    markAllAsRead,
    markNotificationAsRead,
    handleRealtimeNotification,
    markNotificationsAsSeen,
  } = useNotificationStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  // Set up real-time MQTT listener for this screen
  useEffect(() => {
    if (user?.id && MQTTClient.isClientConnected()) {
      // Get the current callback and create a combined one
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.is_read);

  // Handle individual notification click
  const handleNotificationClick = async (notification: Notification) => {
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

        console.log(`Marked notification ${notification.id} as read`);
      } catch (err) {
        console.error("Error marking notification as read", err);
        showToast("error", "Failed to mark notification as read");
      }
    }
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

  useCallback(() => {
    if (hasNewNotifications) {
      markNotificationsAsSeen();
    }
  }, [hasNewNotifications, markNotificationsAsSeen]);

  return (
    <ScreenWrapper>
      <Header title="Notifications" />

      {NotOrderDetails ? (
        <View>
          {/* <OrderDetails  /> */}
        </View>
      ) : (
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
                keyExtractor={(item) => (item.id !== undefined ? item.id.toString() : Math.random().toString())}
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
                ListEmptyComponent={
                  <View className="py-10 mx-auto text-[16px] ">
                    <NoData
                      title="No notifications"
                      subtitle="We will keep you updated when you have a notification. "
                      buttonTitle="Explore ABX stores"
                      onButtonPress={() =>
                        router.push("/Screens/AccountScreen/AllStore")
                      }
                    />
                  </View>
                }
              />
            )}
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}

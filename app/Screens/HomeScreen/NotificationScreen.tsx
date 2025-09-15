import { View, Text, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import Header from "@/common/Header";
import ScreenWrapper from "@/common/ScreenWrapper";
import MarkIcon from "@/assets/svgs/MarkIcon.svg";
import Notificationcard from "@/common/Notificationcard";
import NotificationApi from "@/api/NotificationApi";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import NoData from "@/common/NoData";
import { useRouter } from "expo-router";
import showToast from "@/utils/showToast";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { setUnreadCount } = useNotificationStore();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationApi.getNotifications(1);
      const notificationsList = data.results || [];
      setNotifications(notificationsList);

      const unreadCount = notificationsList.filter(
        (n: any) => !n.is_read
      ).length;
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error(" Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

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

      // Update local state and store
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);

      showToast("success", "✅ All notifications marked as read");
    } catch (err) {
      console.error("❌ Error marking all as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <ScreenWrapper>
      <Header title="Notifications" />

      <View className="mt-[22px]">
        {notifications.length > 0 && (
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
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

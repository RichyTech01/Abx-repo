import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class PushNotificationService {
  private expoPushToken: string | null = null;

  /**
   * Register for push notifications and get Expo Push Token
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log("❌ Push notifications only work on physical devices");
      return null;
    }

    try {
      // Check existing permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Failed to get push notification permissions");
        return null;
      }

      // Get Expo Push Token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      this.expoPushToken = tokenData.data;
      console.log("✅ Expo Push Token:", this.expoPushToken);

      // Android specific channel setup
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error("❌ Error getting push token:", error);
      return null;
    }
  }

  /**
   * Get the current push token
   */
  getToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Add listener for notifications received while app is in foreground
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }


  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export default new PushNotificationService();

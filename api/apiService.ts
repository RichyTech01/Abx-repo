import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";
import showToast from "@/utils/showToast";
import MQTTClient from "@/utils/mqttClient";
import { router } from "expo-router";

class ApiService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: "https://backend.afrobasketxpress.uk/api",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const cartId = await AsyncStorage.getItem("cartId");

        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (cartId) {
          config.headers["X-Cart-ID"] = cartId;
        }
        // console.log("carttt",cartId)
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          // Check if user was actually logged in
          const wasLoggedIn = await AsyncStorage.getItem("accessToken");

          if (wasLoggedIn) {
            console.log("🚪 Session expired - logging out user");

            // Clear session storage
            await AsyncStorage.multiRemove(["accessToken", "cartId"]);

            // Disconnect MQTT immediately
            MQTTClient.disconnect();
            router.replace("/onboarding");

            // Show toast only if user was actually logged in
            showToast("error", "Session expired. Please log in again.");
          } else {
            console.log(
              "🔇 401 received but user already logged out - ignoring"
            );
            MQTTClient.reconnect();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public getClient() {
    return this.client;
  }
}

export default new ApiService();

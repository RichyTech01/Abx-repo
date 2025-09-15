import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import showToast from "@/utils/showToast";
import MQTTClient from "@/utils/mqttClient";

class ApiService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: "https://backend.afrobasketxpress.uk/api",
      timeout: 10000,
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

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          console.log("🚪 Session expired - logging out user");
          
          // Clear session storage
          await AsyncStorage.multiRemove([
            "accessToken", 
          ]);

          // Disconnect MQTT immediately
          MQTTClient.disconnect();

          // Show toast and navigate to login
          showToast("error", "Session expired. Please log in again.");
          
          // Navigate to login screen (replace to prevent back navigation)
          router.replace("/(auth)/onboarding");
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
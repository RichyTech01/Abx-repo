import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";
import showToast from "@/utils/showToast";

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

    // ✅ Request Interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const cartId = await AsyncStorage.getItem("cartId");

        if (accessToken) {
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        }

        if (cartId) {
          config.headers.set("X-Cart-ID", cartId);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response Interceptor (Handle expired session)
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          // Clear session storage
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("cartId");

          showToast("info", "Session expired: cleared tokens");
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

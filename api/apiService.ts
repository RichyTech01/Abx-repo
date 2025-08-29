import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";

class ApiService {
  private client = axios.create({
    baseURL: "https://backend.afrobasketxpress.uk/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  public getClient() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return this.client;
  }
}

export default new ApiService();

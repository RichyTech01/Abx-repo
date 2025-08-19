import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ApiService {
  private client = axios.create({
    baseURL: "https://backend.afrobasketxpress.uk/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  public getClient() {
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return this.client;
  }
}

export default new ApiService();

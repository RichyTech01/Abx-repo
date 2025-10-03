import AsyncStorage from "@react-native-async-storage/async-storage";

class Storage {
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;

      try {
        return JSON.parse(value) as T; // for objects/numbers/arrays
      } catch {
        return value as T; // fallback to raw string (e.g. token)
      }
    } catch (error) {
      console.error(`Storage.get error for key "${key}":`, error);
      return null;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error(`Storage.multiRemove error for keys [${keys.join(", ")}]:`, error);
    }
  }

  async set<T = string>(key: string, value: T): Promise<void> {
    try {
      const data =
        typeof value === "string" ? (value as string) : JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error(`Storage.set error for key "${key}":`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage.remove error for key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Storage.clear error:", error);
    }
  }
}

export default new Storage();

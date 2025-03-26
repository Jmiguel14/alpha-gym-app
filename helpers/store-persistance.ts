import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const setItemAsync = async (key: string, value: string) => {
  const platform = Platform.OS;
  switch (platform) {
    case "ios":
      await SecureStore.setItemAsync(key, value);
      break;
    case "android":
      await SecureStore.setItemAsync(key, value);
      break;
    case "web":
      await AsyncStorage.setItem(key, value);
      break;
    default:
      throw new Error("Unsupported platform");
  }
};

export const getItemAsync = async (key: string) => {
  const platform = Platform.OS;
  switch (platform) {
    case "ios":
      return await SecureStore.getItemAsync(key);
    case "android":
      return await SecureStore.getItemAsync(key);
    case "web":
      return await AsyncStorage.getItem(key);
    default:
      throw new Error("Unsupported platform");
  }
};

export const deleteItemAsync = async (key: string) => {
  const platform = Platform.OS;
  switch (platform) {
    case "ios":
      await SecureStore.deleteItemAsync(key);
      break;
    case "android":
      await SecureStore.deleteItemAsync(key);
      break;
    case "web":
      await AsyncStorage.removeItem(key);
      break;
    default:
      throw new Error("Unsupported platform");
  }
};

export const storePersistance = {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
};

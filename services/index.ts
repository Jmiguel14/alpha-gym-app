import axios from "axios";
import useBoundStore from "../store";
import { Platform } from "react-native";

// const baseURL = Platform.OS === 'android' || Platform.OS == 'ios' ? "http://10.0.2.2:3001" : 'http://localhost:3001' 

const baseURL = 'https://humble-marlin-barely.ngrok-free.app/'

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  const token = await useBoundStore.getState().getSessionFromStore();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useBoundStore.getState().setSession(null);
      useBoundStore.getState().setUser(null);
    }
    return Promise.reject(error);
  }
);

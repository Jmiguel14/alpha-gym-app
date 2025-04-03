import axios from "axios";
import useBoundStore from "../store";

export const api = axios.create({
  baseURL: "http://localhost:3001",
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
    if (error.response.status === 401) {
      useBoundStore.getState().setSession(null);
      useBoundStore.getState().setUser(null);
    }
    return Promise.reject(error);
  }
);

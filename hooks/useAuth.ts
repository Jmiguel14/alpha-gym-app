import useBoundStore from "../store";
import { userService } from "../services/user";
import { Alert } from "react-native";
import { useEffect } from "react";

export const useAuth = () => {
  const {
    user,
    setUser,
    setSession,
    session,
    getSessionFromStore,
    getUserFromStore,
  } = useBoundStore();

  useEffect(() => {
    getSessionFromStore();
    getUserFromStore();
  }, []);

  const login = async (
    email: string,
    password: string,
    { onSuccess }: { onSuccess?: () => void } = {}
  ) => {
    try {
      const { token, ...rest } = await userService.login(email, password);
      setUser(rest);
      setSession(token);
      onSuccess?.();
    } catch (error: any) {
      const message = error?.response?.data?.status?.message;
      if (typeof window !== "undefined") {
        // Web
        window.alert(message);
      } else {
        // React Native
        Alert.alert("Error", message);
      }
    }
  };

  return { user, login, session, setUser, setSession };
};

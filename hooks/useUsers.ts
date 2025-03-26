import { useEffect, useState } from "react";
import { userService } from "../services/user";
import { Platform, Alert } from "react-native";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  net_profit: string;
  commission: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = async () => {
    try {
      const users = await userService.getUsers();
      setUsers(users);
    } catch (error) {
      console.error(error);
      const platform = Platform.OS;
      if (platform === "web") {
        alert("Failed to fetch users");
      } else {
        Alert.alert("Error", "Failed to fetch users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading };
};

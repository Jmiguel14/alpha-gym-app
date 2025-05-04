import { useEffect, useState } from "react";
import { userService } from "../services/user";

export const useUser = (id: string, date: string) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await userService.getUser(id, date);
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, date]);

  return { user, isLoading };
}
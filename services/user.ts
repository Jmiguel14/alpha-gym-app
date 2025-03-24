import { api } from ".";
import UserAdapter from "../adapters/userAdapter";

const login = async (email: string, password: string) => {
  const response = await api.post("/login", { user: { email, password } });
  return UserAdapter.fromApi(response.data);
};

export const userService = {
  login,
};

import { api } from ".";
import UserAdapter from "../adapters/userAdapter";

const login = async (email: string, password: string) => {
  const response = await api.post("/login", { user: { email, password } });
  return UserAdapter.fromApi(response.data);
};

const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const getUser = async (id: string, date: string) => {
  const response = await api.get(`/users/${id}?date=${date}`);
  return response.data;
};

export const userService = {
  login,
  getUsers,
  getUser,
};

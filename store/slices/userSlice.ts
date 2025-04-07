import { StateCreator } from "zustand";
import { storePersistance } from "../../helpers/store-persistance";

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  session: string | null;
  setSession: (token?: string | null) => void;
  getSessionFromStore: () => Promise<string | null>;
  getUserFromStore: () => Promise<string>;
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  setUser: async (user) => {
    set({ user });
    const userString = JSON.stringify(user);
    await storePersistance.setItemAsync("user", userString);
  },
  session: null,
  setSession: async (token) => {
    set({ session: token });
    if (token) {
      await storePersistance.setItemAsync("token", token);
    } else {
      await storePersistance.deleteItemAsync("token");
    }
  },
  getSessionFromStore: async () => {
    const token = await storePersistance.getItemAsync("token");
    set({ session: token });
    return token;
  },
  getUserFromStore: async () => {
    const userString = (await storePersistance.getItemAsync("user")) ?? null;
    const user = JSON.parse(userString as string);
    set({ user });
    return user;
  },
});

export default createUserSlice;

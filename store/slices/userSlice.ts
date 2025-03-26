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
  setUser: (user: User) => void;
  session: string | null;
  setSession: (token?: string | null) => void;
  getSessionFromStore: () => Promise<string | null>;
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
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
});

export default createUserSlice;

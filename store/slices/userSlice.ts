import { create, StateCreator } from "zustand";

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
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  session: null,
  setSession: (token) => {
    // Set session to true if user is logged in by using the expo-secure-store
    set({ session: token });
  },
});

export default createUserSlice;


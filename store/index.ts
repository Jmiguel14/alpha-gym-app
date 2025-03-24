import { create } from "zustand";
import createUserSlice, { UserSlice } from "./slices/userSlice";

const useBoundStore = create<UserSlice>((...a) => ({
  ...createUserSlice(...a),
}));

export default useBoundStore;

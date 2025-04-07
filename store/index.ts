import { create } from "zustand";
import createUserSlice, { UserSlice } from "./slices/userSlice";
import createSaleSlice, { SaleSlice } from "./slices/saleSlice";

const useBoundStore = create<UserSlice & SaleSlice>((...a) => ({
  ...createUserSlice(...a),
  ...createSaleSlice(...a),
}));

export default useBoundStore;

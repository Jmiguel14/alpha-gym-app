import { StateCreator } from "zustand";
import { Sale } from "../../services/interfaces/sales-interface";

export interface SaleSlice {
  sales: Sale[] | []
  setSales: (sales: Sale[] | []) => void
}

const createSaleSlice: StateCreator<SaleSlice> = (set) => ({
  sales: [],
  setSales: async (sales) => {
    set({ sales });
  }
});

export default createSaleSlice;
import { StateCreator } from "zustand";
import { Sale } from "../../services/interfaces/sales-interface";

export interface SaleSlice {
  sales: Sale[] | []
  setSales: (sales: Sale[] | []) => void
  sale: Sale | null
  setSale: (sale: Sale | null) => void
}

const createSaleSlice: StateCreator<SaleSlice> = (set) => ({
  sales: [],
  setSales: async (sales) => {
    set({ sales });
  },
  sale: null,
  setSale: async (sale) => {
    set({ sale });
  },
});

export default createSaleSlice;
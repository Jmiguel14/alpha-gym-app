import { api } from ".";
import { Sale } from "./interfaces/sales-interface";

const getSales = async () => {
  const response = await api.get<{ sales: Sale[] }>("/sales");
  return response.data;
};

export const salesService = {
  getSales,
}

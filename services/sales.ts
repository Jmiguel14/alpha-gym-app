import { api } from ".";
import { Sale } from "./interfaces/sales-interface";

const getSales = async () => {
  const response = await api.get<{ sales: Sale[] }>("/sales");
  return response.data;
};

const getSale = async (id: string) => {
  const response = await api.get<{ sale: Sale }>(`/sales/${id}`);
  return response.data;
}

export const salesService = {
  getSales,
  getSale,
}

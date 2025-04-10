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

const createSale = async (data: Partial<Sale>) => {
  const response = await api.post<{ sale: Sale }>("/sales", {
    sale: data,
  });
  return response.data;
};

const updateSale = async (id: string, data: Partial<Sale>) => {
  const response = await api.put<{ sale: Sale }>(`/sales/${id}`, {
    sale: data,
  });
  return response.data;
}

export const salesService = {
  getSales,
  getSale,
  createSale,
  updateSale,
}

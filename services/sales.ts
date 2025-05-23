import { api } from ".";
import { Sale, SaleUpdate } from "./interfaces/sales-interface";

const getSales = async (searchText: string) => {
  const response = await api.get<{ sales: Sale[] }>("/sales?search=" + searchText);
  return response.data;
};

const getSale = async (id: string) => {
  const response = await api.get<{ sale: Sale }>(`/sales/${id}`);
  return response.data;
};

const createSale = async (data: Partial<Sale>) => {
  const response = await api.post<{ sale: Sale }>("/sales", {
    sale: { ...data },
  });
  return response.data;
};

const updateSale = async (id: string, data: SaleUpdate) => {
  const response = await api.put<{ sale: Sale }>(`/sales/${id}`, {
    sale: {
      ...data,
      sale_details_attributes: data.sale_details,
    },
  });
  return response.data;
};

const deleteSale = async (id: number) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};


export const salesService = {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
};

import { api } from ".";
import { Client } from "./interfaces/client-interface";

const getClients = async () => {
  const response = await api.get<{ clients: Client[] }>("/clients");
  return response.data;
};

export const clientService = {
  getClients,
};

import { useEffect, useState } from "react";
import { salesService } from "../services/sales";
import { Sale, SaleUpdate } from "../services/interfaces/sales-interface";
import { useSales } from "./useSales";

export const useSale = (id?: string) => {
  const [sale, setSale] = useState<Sale | null>(null);
  const {fetchSales} = useSales();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchSale = async (id: string) => {
    try {
      const response = await salesService.getSale(id);
      setSale(response.sale);
    } catch (error) {
      console.error("Error fetching sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (
    data: Partial<Sale>,
    { onSuccess }: { onSuccess?: (sale: Sale) => void } = {}
  ) => {
    setCreating(true);
    try {
      const response = await salesService.createSale(data);
      fetchSales();
      onSuccess && onSuccess(response.sale);
    } catch (error) {
      console.error("Error creating sale:", error);
    } finally {
      setCreating(false);
    }
  }

  const updateSale = async (
    id: string,
    data: SaleUpdate,
    { onSuccess }: { onSuccess?: () => void } = {}
  ) => {
    setUpdating(true);
    try {
      const response = await salesService.updateSale(id, data);
      setSale(response.sale);
      fetchSales();
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error updating sale:", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    id && fetchSale(id);
  }, [id]);

  return {
    sale,
    loading,
    updating,
    fetchSale,
    updateSale,
    createSale,
    creating,
  };
};

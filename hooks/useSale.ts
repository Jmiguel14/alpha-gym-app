import { useEffect, useState } from "react";
import { salesService } from "../services/sales";
import { Sale } from "../services/interfaces/sales-interface";
import { useSales } from "./useSales";

export const useSale = (id: string) => {
  const [sale, setSale] = useState<Sale | null>(null);
  const {fetchSales} = useSales();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const updateSale = async (
    id: string,
    data: Partial<Sale>,
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
  };
};

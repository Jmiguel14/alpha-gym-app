import { useEffect, useState } from "react";
import { salesService } from "../services/sales";
import { Sale } from "../services/interfaces/sales-interface";

export const useSale = (id: string) => {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSale = async (id: string) => {
    try {
      const response = await salesService.getSale(id);
      setSale(response.sale);
    } catch (error) {
      console.error("Error fetching sale:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    id && fetchSale(id);
  }, [id])

  return {
    sale,
    loading,
    fetchSale,
  };
}
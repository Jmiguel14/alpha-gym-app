import { useEffect, useState } from "react";
import { Sale } from "../services/interfaces/sales-interface";
import { salesService } from "../services/sales";

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const response = await salesService.getSales();
      setSales(response.sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales();
  }, [])

  return {
    sales,
    loading,
  };
}
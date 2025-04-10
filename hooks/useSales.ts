import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Sale } from "../services/interfaces/sales-interface";
import { salesService } from "../services/sales";
import useBoundStore from "../store";

export const useSales = () => {
  const { sales, setSales } = useBoundStore(
    useShallow((state) => ({ sales: state.sales, setSales: state.setSales }))
  );

  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const response = await salesService.getSales();
      const salesResponse = response.sales.map((sale: Sale) => ({
        name: sale.name,
        description: sale.description,
        total_amount: sale.total_amount,
        status: sale.status,
      }));
      setSales(response.sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    fetchSales,
  };
};

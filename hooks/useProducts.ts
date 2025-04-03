import { useEffect, useState } from "react";
import { Product } from "../services/interfaces/product-interface";
import { productService } from "../services/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setUpdatingProduct(true);
    try {
      await productService.updateProduct(product);
      fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingProduct(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    updateProduct,
    updatingProduct,
    loading
  };
}

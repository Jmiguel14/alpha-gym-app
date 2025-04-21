import { useEffect, useState } from "react";
import { Product } from "../services/interfaces/product-interface";
import { productService } from "../services/products";

interface AsyncCallbacks {
  onSuccess?: (data: Product) => void;
}

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

  const createProduct = async (
    product: Product,
    callbacks?: AsyncCallbacks
  ) => {
    setUpdatingProduct(true);
    try {
      await productService.createProduct(product);
      fetchProducts();
      callbacks?.onSuccess?.(product)
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingProduct(false);
    }
  };

  const updateProduct = async (product: Product, callbacks?: AsyncCallbacks) => {
    setUpdatingProduct(true);
    try {
      await productService.updateProduct(product);
      fetchProducts();
      callbacks?.onSuccess?.(product)
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
    createProduct,
    updateProduct,
    updatingProduct,
    loading,
  };
};

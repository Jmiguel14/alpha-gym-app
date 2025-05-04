import { useEffect, useState } from "react";
import { Product } from "../services/interfaces/product-interface";
import { productService } from "../services/products";
import { useDebounce } from "./useDebounce";

interface AsyncCallbacks {
  onSuccess?: (data: Product) => void;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { debouncedValue } = useDebounce({
    value: searchText,
    delay: 500,
  });

  const fetchProducts = async (text: string) => {
    try {
      const data = await productService.getProducts(text);
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
      fetchProducts(debouncedValue);
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
      fetchProducts(debouncedValue);
      callbacks?.onSuccess?.(product)
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingProduct(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedValue);
  }, [debouncedValue]);

  return {
    products,
    createProduct,
    updateProduct,
    searchText,
    setSearchText,
    updatingProduct,
    loading,
  };
};

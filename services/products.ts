import { api } from ".";
import { Product } from "./interfaces/product-interface";

const getProducts = async (searchText: string) => {
  const response = await api.get<Product[]>("/products?search=" + searchText);
  return response.data;
};

const createProduct = async (product: Product) => {
  const response = await api.post<Product>("/products", {
    product,
  });
  return response.data;
};

const updateProduct = async (product: Product) => {
  const response = await api.put<Product>(`/products/${product.id}`, {
    product,
  });
  return response.data;
};

export const productService = {
  getProducts,
  updateProduct,
  createProduct,
};

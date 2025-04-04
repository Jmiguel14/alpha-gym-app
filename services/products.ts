import { api } from ".";
import { Product } from "./interfaces/product-interface";

const getProducts = async () => {
  const response = await api.get<Product[]>("/products");
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
};

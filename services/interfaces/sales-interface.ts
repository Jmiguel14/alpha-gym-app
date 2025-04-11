import { Product } from "./product-interface";

export interface SaleDetail {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  discount: string;
  unit_price: string;
  total_price: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

interface Seller {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface Client {
  id: number;
  name: string;
  email: string;
}

export interface Sale {
  id: number;
  client_id: number;
  seller_id: number;
  discount: string;
  total_amount: string;
  date: string;
  name: string | null;
  description: string | null;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  sale_details: SaleDetail[];
  seller: Seller;
  client: Client;
}

export interface SaleUpdate extends Partial<Omit<Sale, 'sale_details'>> {
  sale_details?: Partial<SaleDetail>[];
}
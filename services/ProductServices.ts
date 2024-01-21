import axios from "axios";
import { Product } from "@/types";

export const getProducts = async (shopId: string, page: number) => {
  const { data } = await axios.get(`/api/shop/${shopId}/product?page=${page}`);
  // return data.products as Product[];
  return {
    products: data.products,
    totalProductsCount: data.totalProductsCount,
  } as { products: Product[]; totalProductsCount: number };
};

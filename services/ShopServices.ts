import axios from "axios";
import { Shop, UserRoles } from "@/types";

export const getAllShops = async () => {
  const response = await axios.get("/api/shop");
  return response.data.shops as Shop[];
};
export const getUserRole = async (shopId: string) => {
  const response = await axios.get(`/api/shop/${shopId}/role`);
  return response.data.userRole.role as UserRoles;
};

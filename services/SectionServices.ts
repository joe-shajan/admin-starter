import axios from "axios";
import { Sections } from "@/types";

export const getSections = async () => {
  const { data } = await axios.get(`/api/sections`);
  return data as Sections[];
};

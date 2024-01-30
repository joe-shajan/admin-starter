import axios from "axios";
import { Sections } from "@/types";

export const getSections = async () => {
  const { data } = await axios.get(`/api/sections`);
  return data as Sections[];
};

export const getSection = async (id: string) => {
  const { data } = await axios.get(`/api/sections/${id}`);
  return data as Sections;
};

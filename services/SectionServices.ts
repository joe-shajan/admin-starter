import axios from "axios";
import { Section, SectionItem } from "@/types";

export interface SectionWithItems extends Section {
  sectionItems: SectionItem[];
}

export const getSections = async () => {
  const { data } = await axios.get(`/api/sections`);
  return data as Section[];
};

export const getSection = async (id: string) => {
  const { data } = await axios.get(`/api/sections/${id}`);
  console.log(data);

  return data as SectionWithItems;
};

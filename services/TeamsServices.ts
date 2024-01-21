import axios from "axios";
import { TeamMemberWithUser } from "@/types";

export const getTeamMembers = async (shopId: string) => {
  const { data } = await axios.get(`/api/shop/${shopId}/team`);
  return data.teamMembers as TeamMemberWithUser[];
};

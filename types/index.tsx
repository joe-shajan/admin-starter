import type { Shop, User, TeamMember, Product } from "@prisma/client";

export { Shop, User, TeamMember, Product };

export type UserRoles = "ADMIN" | "MANAGER";

export type TeamMemberWithUser = {
  id: string;
  userId: string;
  user: User;
  shopId: string;
  role: UserRoles;
};

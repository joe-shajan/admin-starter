"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/types";
import { getServerSession } from "next-auth";
import prisma from "./prisma";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (e: any) {
    console.log(e);
    // simply ignores if no user is logged in
    return null;
  }
};

// Import necessary modules and initialize Prisma

import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
  try {
    // Extract the userId and shopId from the request or your routing parameters
    const { shopId } = params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // Use Prisma to query the specific TeamMember record
    const userRole = await prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        shopId: shopId,
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json({ userRole });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getCurrentUser } from "@/utils";

export async function POST(request: Request) {
  try {
    const shopData = await request.json();

    const user = await getCurrentUser();

    if (!user) throw new Error("user not found");

    const createdShop = await prisma.shop.create({
      data: {
        ...shopData,
        owner: {
          connect: { id: user?.id },
        },
        managers: {
          create: [
            {
              userId: user?.id,
              role: "ADMIN",
            },
          ],
        },
      },
    });

    return NextResponse.json({ createdShop });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

// Import necessary modules and initialize Prisma

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error("User not found");

    const shops = await prisma.shop.findMany({
      where: {
        ownerId: user.id,
      },
    });

    const shopsWhereUserIsMember = await prisma.shop.findMany({
      where: {
        NOT: {
          ownerId: user.id, // Exclude shops where the user is the owner
        },
        managers: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ shops: [...shops, ...shopsWhereUserIsMember] });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

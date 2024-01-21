import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

type paramsType = {
  params: {
    shopId: string;
  };
};

export async function GET(request: Request, { params }: paramsType) {
  try {
    const { shopId } = params;

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        shopId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ teamMembers });
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

export async function POST(request: Request, { params }: paramsType) {
  try {
    const { shopId } = params;
    const body = await request.json();

    let user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: body.email,
        },
      });
    }

    // Create a new TeamMember with the user's ID
    const newTeamMember = await prisma.teamMember.create({
      data: {
        userId: user.id,
        shopId: shopId,
        role: body.role,
      },
    });

    return NextResponse.json({ newTeamMember: { ...newTeamMember, user } });
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

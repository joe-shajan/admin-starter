import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  try {
    const data = await request.json();
    const { name, type } = data;

    if (!user) {
      throw new Error("User not found");
    }

    const section = await prisma.sections.create({
      data: { name, type, User: { connect: { id: user.id } } },
    });

    return NextResponse.json(section);
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

export async function GET(request: Request) {
  const userDetails = await getCurrentUser();

  try {
    if (!userDetails) {
      return NextResponse.json(
        {
          error: "user not found",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userDetails.id },
      include: { sections: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user.sections);
  } catch (error: any) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

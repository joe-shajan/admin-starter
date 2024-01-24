import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

const userId = "65ad599feb001cc341ee9a22";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, type } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const section = await prisma.sections.create({
      data: { name, type, User: { connect: { id: userId } } },
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
  try {
    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

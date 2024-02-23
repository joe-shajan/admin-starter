import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: any) {
  const userId = params.userId as string;

  try {
    const sections = await prisma.section.findMany({
      where: {
        userId: userId,
      },
      include: {
        sectionItems: true,
      },
    });

    return NextResponse.json(sections);
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

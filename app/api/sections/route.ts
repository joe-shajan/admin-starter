import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, type } = data;

    const user = await prisma.sections.create({
      data: { name, type },
    });

    return NextResponse.json(user);
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
    const sections = await prisma.sections.findMany();
    return NextResponse.json(sections);
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

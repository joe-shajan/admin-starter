import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, ...userData } = data;

    // Check if a user with the provided email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If the password is null or undefined, update user details
      if (!existingUser.password) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            name: userData.name,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
          },
        });
        return NextResponse.json(updatedUser);
      } else {
        // If the password is provided, return an error
        return NextResponse.json(
          {
            error: "User already exists",
          },
          { status: 400 }
        );
      }
    } else {
      const { name, email, phoneNumber, password } = data;
      const user = await prisma.user.create({
        data: { email, name, phoneNumber, password }, // TODO: password needs to be hashed
      });

      return NextResponse.json(user);
    }
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

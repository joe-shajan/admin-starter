import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      url: "https://agency-demo-joe.s3.ap-south-1.amazonaws.com/EP+SHOWREEL++FOR+WEBSITE+.mp4",
    });
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

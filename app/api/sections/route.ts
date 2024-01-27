import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

async function uploadFileToS3(fileBuffer: any, fileName: string, type: string) {
  const contentTypes: any = {
    IMAGE: "image/jpg",
    VIDEO: "video/mp4",
  };

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const encodedFileName = encodeURIComponent(fileName);

  const params = {
    Bucket: bucketName,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: contentTypes[type],
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${bucketName}.s3.amazonaws.com/${encodedFileName}`;
}

export async function POST(request: any) {
  const user = await getCurrentUser();

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const type = formData.get("type");
    const file = formData.get("file");
    const text = formData.get("text");
    const embedUrl = formData.get("embedUrl");

    if (!user) {
      throw new Error("User not found");
    }

    if ((type === "IMAGE" || type === "VIDEO") && file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(buffer, file.name, type);

      const section = await prisma.sections.create({
        data: { name, type, url: fileName, User: { connect: { id: user.id } } },
      });

      return NextResponse.json(section);
    }

    if (type === "TEXT" && text) {
      const section = await prisma.sections.create({
        data: { name, type, text, User: { connect: { id: user.id } } },
      });

      return NextResponse.json(section);
    }

    if (type === "EMBEDED" && embedUrl) {
      const section = await prisma.sections.create({
        data: { name, type, url: embedUrl, User: { connect: { id: user.id } } },
      });

      return NextResponse.json(section);
    }
    throw new Error("Incorrect data or type");
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

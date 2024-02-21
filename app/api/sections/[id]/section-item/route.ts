import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

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

async function deleteFileFromS3(fileName: string): Promise<void> {
  try {
    // Specify parameters for S3 object deletion
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);

    await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
}

const addDate = (fileName: string): string => {
  return `${fileName}-${Date.now()}`;
};

export async function POST(request: any, { params }: any) {
  const user = await getCurrentUser();
  const sectionId = params.id as string;
  try {
    const formData = await request.formData();
    const heading1 = formData.get("headding1");
    const heading2 = formData.get("headding2");
    const text1 = formData.get("text1");
    const text2 = formData.get("text2");
    const contentType = formData.get("contentType");
    const file = formData.get("file");
    const url = formData.get("url");

    if (!user) {
      throw new Error("User not found");
    }

    const sectionData = {
      heading1: heading1 ? heading1 : undefined,
      heading2: heading2 ? heading2 : undefined,
      text1: text1 ? text1 : undefined,
      text2: text2 ? text2 : undefined,
      contentType: contentType,
      url: url ? url : undefined,
    };

    if (file && (contentType === "IMAGE" || contentType === "VIDEO")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(
        buffer,
        addDate(file.name),
        contentType
      );

      sectionData.url = fileName;
    }

    const section = await prisma.sectionItem.create({
      data: {
        ...sectionData,
        Section: { connect: { id: sectionId.toString() } },
      },
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

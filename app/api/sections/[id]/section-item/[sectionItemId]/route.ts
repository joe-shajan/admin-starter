import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
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

export async function PUT(request: any, { params }: any) {
  const user = await getCurrentUser();
  const sectionItemId = params.sectionItemId as string;
  try {
    const formData = await request.formData();
    const heading1 = formData.get("heading1");
    const heading2 = formData.get("heading2");
    const text1 = formData.get("text1");
    const text2 = formData.get("text2");
    const contentType = formData.get("contentType");
    const file = formData.get("file");
    const url = formData.get("url");

    if (!user) {
      throw new Error("User not found");
    }

    const existingSectionItem = await prisma.sectionItem.findUnique({
      where: { id: sectionItemId },
    });

    if (!existingSectionItem) {
      throw new Error("Section Item not found");
    }

    const oldFileUrl = existingSectionItem.url;

    const sectionData = {
      heading1: heading1 ? heading1 : existingSectionItem.heading1,
      heading2: heading2 ? heading2 : existingSectionItem.heading2,
      text1: text1 ? text1 : existingSectionItem.text1,
      text2: text2 ? text2 : existingSectionItem.text2,
      contentType: contentType || existingSectionItem.contentType,
      url: url ? url : existingSectionItem.url,
    };

    if (file && (contentType === "IMAGE" || contentType === "VIDEO")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(
        buffer,
        addDate(file.name),
        contentType
      );

      sectionData.url = fileName;

      // Delete old file from S3
      if (oldFileUrl) {
        await deleteFileFromS3(oldFileUrl);
      }
    }

    const updatedSectionItem = await prisma.sectionItem.update({
      where: { id: sectionItemId },
      data: sectionData,
    });

    return NextResponse.json(updatedSectionItem);
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

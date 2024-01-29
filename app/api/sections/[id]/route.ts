import { getCurrentUser } from "@/utils";
import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

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

export async function DELETE(request: Request, { params }: any) {
  const userDetails = await getCurrentUser();

  try {
    if (!userDetails) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 400 }
      );
    }

    const sectionId = params.id as string;

    const section = await prisma.sections.findUnique({
      where: { id: sectionId },
      include: { User: true },
    });

    if (!section) {
      return NextResponse.json(
        {
          error: "Section not found",
        },
        { status: 404 }
      );
    }

    if (section.User.id !== userDetails.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if ((section.type === "IMAGE" || section.type === "VIDEO") && section.url) {
      await deleteFileFromS3(section.url);
    }

    // Delete section from database
    await prisma.sections.delete({
      where: { id: sectionId },
    });

    return NextResponse.json(
      {
        message: "Section deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

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

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { User: true, sectionItems: true },
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

    // Delete associated files from S3 if section type is IMAGE or VIDEO
    if (
      section.sectionItems.some(
        (item) => item.contentType === "IMAGE" || item.contentType === "VIDEO"
      ) &&
      section.sectionItems.some((item) => item.url)
    ) {
      await Promise.all(
        section.sectionItems
          .filter(
            (item) =>
              item.contentType === "IMAGE" || item.contentType === "VIDEO"
          )
          .map(async (item) => {
            if (item.url) {
              await deleteFileFromS3(item.url);
            }
          })
      );
    }

    // Delete section from database
    await prisma.section.delete({
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

export async function GET(request: Request, { params }: any) {
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

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        User: true,
        sectionItems: {
          orderBy: {
            addedTime: "desc",
          },
        },
      },
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

    return NextResponse.json(section);
  } catch (error: any) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

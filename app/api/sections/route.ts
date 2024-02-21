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

// export async function POST(request: any) {
//   const user = await getCurrentUser();

//   try {
//     const formData = await request.formData();
//     const name = formData.get("name");
//     const type = formData.get("type");
//     const file = formData.get("file");
//     const text = formData.get("text");
//     const embedUrl = formData.get("embedUrl");

//     if (!user) {
//       throw new Error("User not found");
//     }

//     if ((type === "IMAGE" || type === "VIDEO") && file) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const fileName = await uploadFileToS3(buffer, addDate(file.name), type);

//       const section = await prisma.sections.create({
//         data: { name, type, url: fileName, User: { connect: { id: user.id } } },
//       });

//       return NextResponse.json(section);
//     }

//     if (type === "TEXT" && text) {
//       const section = await prisma.sections.create({
//         data: { name, type, text, User: { connect: { id: user.id } } },
//       });

//       return NextResponse.json(section);
//     }

//     if (type === "EMBEDDED" && embedUrl) {
//       const section = await prisma.sections.create({
//         data: { name, type, url: embedUrl, User: { connect: { id: user.id } } },
//       });

//       return NextResponse.json(section);
//     }
//     throw new Error("Incorrect data or type");
//   } catch (error: any) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         error: error.message,
//         errorCode: error.code,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: any) {
  const user = await getCurrentUser();

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const sectionType = formData.get("sectionType");

    if (!user) {
      throw new Error("User not found");
    }

    const section = await prisma.section.create({
      data: {
        name,
        sectionType,
        User: { connect: { id: user.id } },
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

export async function PUT(request: any) {
  const user = await getCurrentUser();

  try {
    if (!user) {
      throw new Error("User not found");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const sectionItemId = formData.get("sectionItemId");
    const name = formData.get("name");
    const sectionType = formData.get("sectionType");
    const contentType = formData.get("contentType");
    const heading1 = formData.get("heading1");
    const heading2 = formData.get("heading2");
    const text1 = formData.get("text1");
    const text2 = formData.get("text2");
    const url = formData.get("url");

    if (!id) {
      throw new Error("Section ID not provided");
    }

    let updatedSection;

    updatedSection = await prisma.section.update({
      where: { id },
      data: {
        name,
        sectionType,
        sectionItems: {
          update: {
            where: { id: sectionItemId },
            data: {
              heading1,
              heading2,
              text1,
              text2,
              contentType,
              url,
            },
          },
        },
      },
    });

    return NextResponse.json(updatedSection);
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

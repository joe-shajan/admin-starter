import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

async function uploadFileToS3(file: any, fileName: any) {
  const fileBuffer = file;
  console.log(fileName);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    // ContentType: "image/jpg",
    ContentType: "video/mp4",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request: any) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    console.log(process.env.AWS_S3_ACCESS_KEY_ID);
    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    console.log("contenttype", file.mimetype);
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: any) {
  try {
    const productData = await request.json();

    const { shopId } = params;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new Error("Shop not found");
    }

    productData.price = +productData.price;

    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        shop: {
          connect: { id: shopId },
        },
      },
    });

    return NextResponse.json({ createdProduct });
  } catch (error: any) {
    console.error(error);

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
  try {
    const { shopId } = params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new Error("Shop not found");
    }

    const totalProductsCount = await prisma.product.count({
      where: {
        shopId: shopId,
      },
    });

    const take = 10;

    const skip = page ? +page * take : 1;

    const products = await prisma.product.findMany({
      where: {
        shopId: shopId,
      },
      take,
      skip,
    });

    return NextResponse.json({ products, totalProductsCount });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}

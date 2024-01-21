import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: any) {
  try {
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
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

export async function PUT(request: Request, { params }: any) {
  try {
    const { productId } = params;
    const productData = await request.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    productData.price = +productData.price;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
      },
    });

    return NextResponse.json({ updatedProduct });
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

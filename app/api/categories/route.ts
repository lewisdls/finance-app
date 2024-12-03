import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("Error getting categories: ", error);
    return NextResponse.json({
      error: "Error getting categories",
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("Error creating category: ", error);
    return NextResponse.json({
      error: "Error creating category",
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
  } catch (error) {
    console.log("Error updating category: ", error);
    return NextResponse.json({
      error: "Error updating category",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
  } catch (error) {
    console.log("Error deleting category: ", error);
    return NextResponse.json({
      error: "Error deleting category",
      status: 500,
    });
  }
}

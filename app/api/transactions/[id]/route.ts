import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extracting the id from the query parameters
    const { pathname } = new URL(req.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Fetch the transaction by its unique ID
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id, // `id` from query parameter
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error getting transaction: ", error);
    return NextResponse.json({
      error: "Error getting transaction",
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];

  try {
    const { amount, type, category, merchant, date } = await req.json();

    if (amount === 0 || category === "" || merchant === "" || date === "") {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const transaction = await prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        amount,
        type,
        category,
        merchant,
        date,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.log("Error updating transaction: ", error);
    return NextResponse.json({
      error: "Error updating transaction",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];
  try {
    const transaction = await prisma.transaction.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.log("Error deleting transaction: ", error);
    return NextResponse.json({
      error: "Error deleting transaction",
      status: 500,
    });
  }
}

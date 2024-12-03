import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: [
        {
          date: "desc",
        },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.log("Error getting transactions: ", error);
    return NextResponse.json({
      error: "Error getting transactions",
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { amount, type, category, merchant, date } = await req.json();

    if (amount === 0 || category === "" || merchant === "" || date === "") {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const transaction = await prisma.transaction.create({
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
    console.log("Error creating transaction: ", error);
    return NextResponse.json({
      error: "Error creating transaction",
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
  } catch (error) {
    console.log("Error updating transaction: ", error);
    return NextResponse.json({
      error: "Error updating transaction",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
  } catch (error) {
    console.log("Error deleting transaction: ", error);
    return NextResponse.json({
      error: "Error deleting transaction",
      status: 500,
    });
  }
}

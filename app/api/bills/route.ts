import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: {
        amount: "desc",
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.log("Error getting bills: ", error);
    return NextResponse.json({
      error: "Error getting bills",
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { amount, merchant, recurrency, isPaid } = await req.json();

    if (!amount || !merchant || !recurrency || isPaid) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const bill = await prisma.bill.create({
      data: {
        amount,
        merchant,
        recurrency,
        isPaid,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.log("Error creating bill: ", error);
    return NextResponse.json({
      error: "Error creating bill",
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
  } catch (error) {
    console.log("Error updating bill: ", error);
    return NextResponse.json({
      error: "Error updating bill",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
  } catch (error) {
    console.log("Error deleting bill: ", error);
    return NextResponse.json({
      error: "Error deleting bill",
      status: 500,
    });
  }
}

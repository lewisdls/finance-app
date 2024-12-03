import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json(
        { error: "Bill ID is required" },
        { status: 400 }
      );
    }

    const bill = await prisma.bill.findUnique({
      where: {
        id: id,
      },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error getting bill: ", error);
    return NextResponse.json({
      error: "Error getting bill",
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];

  try {
    const { amount, merchant, recurrency, isPaid } = await req.json();

    if (!amount || !merchant || !recurrency) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const bill = await prisma.bill.update({
      where: {
        id: id,
      },
      data: {
        amount,
        merchant,
        recurrency,
        isPaid,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.log("Error updating bill: ", error);
    return NextResponse.json({
      error: "Error updating bill",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];
  try {
    const bill = await prisma.bill.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.log("Error deleting bill: ", error);
    return NextResponse.json({
      error: "Error deleting bill",
      status: 500,
    });
  }
}

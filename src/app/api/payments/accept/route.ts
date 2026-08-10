import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId as string; // Prisma ID is string

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "APPROVED" }, // ✅ string literal instead of PaymentStatus
    });

    return NextResponse.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to approve payment" }, { status: 500 });
  }
}

// payments/decline/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId as string;

    // Update the payment status to "REJECTED"
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REJECTED" }, // ✅ string literal, no Prisma enum import needed
    });

    return NextResponse.json({ success: true, payment });
  } catch (err) {
    console.error("Decline payment error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to decline payment" },
      { status: 500 }
    );
  }
}

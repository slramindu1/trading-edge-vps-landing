export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("🔥 coupon check HIT");

  try {
    const { code } = await request.json();
    const trimmedCode = typeof code === "string" ? code.trim() : "";

    if (!trimmedCode) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: {
          equals: trimmedCode,
          mode: "insensitive",
        },
        isActive: true,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon code not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return NextResponse.json(
        { success: false, message: "This discount is not active yet" },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && now > coupon.expiresAt) {
      return NextResponse.json(
        { success: false, message: "Coupon code has expired" },
        { status: 400 }
      );
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discount: coupon.discount,
    });
  } catch (error) {
    console.error("Coupon check error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

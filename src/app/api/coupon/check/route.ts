export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("🔥 coupon check HIT");

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        isActive: true,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon code not found" },
        { status: 404 }
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

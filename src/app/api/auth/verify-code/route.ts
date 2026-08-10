// app/api/auth/verify-code/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json()

    if (!email || !pin) {
      return NextResponse.json(
        { success: false, message: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        verification_code: true,
        reset_token_expiry: true,
        is_paid: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please request a new code.' },
        { status: 404 }
      )
    }

    // Check if verification code exists
    if (!user.verification_code) {
      return NextResponse.json(
        { success: false, message: 'No verification code found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (user.verification_code !== pin) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code.' },
        { status: 401 }
      )
    }

    // Check if code expired
    if (!user.reset_token_expiry || user.reset_token_expiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please request a new one.' },
        { status: 401 }
      )
    }

    // Clear verification code after successful verification
    await prisma.user.update({
      where: { email },
      data: {
        verification_code: null,
        reset_token_expiry: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.fname} ${user.lname}`,
        isPaid: user.is_paid || false
      }
    })

  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
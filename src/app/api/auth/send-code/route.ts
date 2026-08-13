// app/api/auth/send-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Update existing user's verification code
      await prisma.user.update({
        where: { email },
        data: {
          verification_code: code,
          reset_token_expiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
      })
    } else {
      // Create a placeholder user account (inactive) — will be activated on payment approval
      user = await prisma.user.create({
        data: {
          email,
          fname: '',
          lname: '',
          verification_code: code,
          reset_token_expiry: new Date(Date.now() + 10 * 60 * 1000),
          user_type_id: 2, // Student
          status_id: 2,    // Inactive until payment approved
          mobile: '',
          aboutMe: ''
        }
      })
    }

    // Send verification email
    const emailResult = await sendEmail({
      to: email,
      subject: `Your Verification Code - ${process.env.APP_NAME || 'Trading Edge FX'}`,
      html: emailTemplates.verificationCode(code, user?.fname)
    })

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error)
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully to your email',
      email: email,
      // Don't send code in response for security
    })

  } catch (error: any) {
    console.error('Send code error:', error)
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Email already exists in system' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    )
  }
}
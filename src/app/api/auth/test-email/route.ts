// app/api/auth/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const testEmail = 'your-test-email@gmail.com' // Change this to your email
    
    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email from Trading Edge FX',
      html: emailTemplates.verificationCode('123456', 'Test User')
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { success: false, message: 'Test email failed' },
      { status: 500 }
    )
  }
}
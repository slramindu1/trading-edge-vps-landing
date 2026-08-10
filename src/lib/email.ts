// lib/email.ts
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Verify connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error)
  } else {
    console.log('SMTP Server is ready to take messages')
  }
})

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Trading Edge FX'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Specific email templates
export const emailTemplates = {
  verificationCode: (code: string, name?: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 15px; background: #fff; border-radius: 5px; border: 2px dashed #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${process.env.APP_NAME || 'Trading Edge FX'}</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <h2>Hello${name ? ' ' + name : ''}!</h2>
          <p>Thank you for registering with ${process.env.APP_NAME || 'Trading Edge FX'}. Please use the verification code below to complete your registration:</p>
          
          <div class="code">${code}</div>
          
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          
          <p>Best regards,<br>
          ${process.env.APP_NAME || 'Trading Edge FX'} Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Trading Edge FX'}. All rights reserved.</p>
          <p>${process.env.APP_URL || 'http://localhost:3000'}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  paymentConfirmation: (paymentDetails: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
    </head>
    <body>
      <h1>Payment Received</h1>
      <p>Dear ${paymentDetails.name},</p>
      <p>Your payment of $${paymentDetails.amount} has been received successfully.</p>
      <p>Payment ID: ${paymentDetails.paymentId}</p>
      <p>Thank you for your purchase!</p>
    </body>
    </html>
  `
}
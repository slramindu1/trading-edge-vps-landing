import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Check if environment variables are set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.error("EMAIL_USER or EMAIL_PASSWORD is not set in .env");
            return NextResponse.json({ success: false, error: 'Email credentials not configured' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Using Gmail, assuming standard SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'ramindu.jiat@gmail.com',
            subject: `🚨 UI Bug Alert: Text Stuck at Opacity 0 on ${data.url}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #d9534f;">Frontend Debug Report - Trading Edge Landing Page</h2>
                    <p>An issue was detected where text failed to load and was stuck at opacity 0.</p>
                    <p><strong>URL:</strong> ${data.url}</p>
                    <p><strong>Time:</strong> ${data.timestamp}</p>
                    <p><strong>User Agent:</strong> ${data.userAgent}</p>
                    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;"/>
                    <h3 style="color: #333;">Component State:</h3>
                    <ul style="background: #f9f9f9; padding: 15px 30px; border-radius: 5px;">
                        <li><strong>Hydration:</strong> ${data.hydrationState}</li>
                        <li><strong>Viewport Status:</strong> ${data.viewportStatus}</li>
                        <li><strong>Animation Status:</strong> ${data.animationStatus}</li>
                        <li><strong>Computed Opacity:</strong> <span style="color: red; font-weight: bold;">${data.computedOpacity}</span></li>
                        <li><strong>Computed Visibility:</strong> <span style="color: red; font-weight: bold;">${data.computedVisibility}</span></li>
                        <li><strong>CSS Classes:</strong> <code>${data.className}</code></li>
                    </ul>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Debug report sent' }, { status: 200 });
    } catch (error) {
        console.error('Error sending debug email:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}

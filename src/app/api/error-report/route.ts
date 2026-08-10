// app/api/error-report/route.ts
//
// Receives error reports from the frontend (page.tsx) and forwards a
// rich HTML email to the owner's personal email (ALERT_EMAIL env var).
//
// This is a fire-and-forget endpoint — it always returns 200 so that
// a failed alert never breaks the user's checkout experience.

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Stage → badge colour mapping
const STAGE_COLORS: Record<string, string> = {
  "send-code":   "#F59E0B",
  verify:        "#8B5CF6",
  coupon:        "#3B82F6",
  "file-upload": "#EF4444",
  payment:       "#DC2626",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      stage,
      errorMessage,
      userEmail,
      userName,
      amount,
      discount,
      couponCode,
      fileName,
      fileSize,
      fileMime,
      serverResponse,
      signalInfo,
    } = body;

    const alertTo = process.env.ALERT_EMAIL;

    if (
      !alertTo ||
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("⚠️  ALERT_EMAIL or SMTP credentials missing — skipping frontend alert");
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const badgeColor = STAGE_COLORS[stage] ?? "#6B7280";

    // Build signal info rows
    const signal = signalInfo ?? {};
    const signalRows = Object.entries(signal as Record<string, unknown>)
      .map(
        ([k, v]) =>
          `<tr>
            <td style="padding:4px 10px;font-weight:600;color:#374151;white-space:nowrap;background:#F9FAFB;">${k}</td>
            <td style="padding:4px 10px;color:#6B7280;word-break:break-all;">${v}</td>
          </tr>`
      )
      .join("");

    // File info section
    const fileSection =
      fileName
        ? `<div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 16px;margin:16px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0 0 6px;font-weight:700;color:#92400E;">📎 File Info</p>
            <p style="margin:2px 0;color:#78350F;">Name: <code style="background:#FDE68A;padding:1px 4px;border-radius:3px;">${fileName}</code></p>
            <p style="margin:2px 0;color:#78350F;">Size: ${fileSize ? (fileSize / 1024).toFixed(1) + " KB" : "unknown"}</p>
            <p style="margin:2px 0;color:#78350F;">MIME: <code style="background:#FDE68A;padding:1px 4px;border-radius:3px;">${fileMime || "(empty — mobile browser bug)"}</code></p>
          </div>`
        : "";

    // Server response dump
    const serverSection =
      serverResponse !== undefined && serverResponse !== null
        ? `<div style="background:#F3F4F6;border-radius:6px;padding:12px 16px;margin:16px 0;">
            <p style="margin:0 0 8px;font-weight:700;color:#374151;">🖥️ Server Response</p>
            <pre style="margin:0;font-size:12px;color:#4B5563;overflow-x:auto;white-space:pre-wrap;">${JSON.stringify(serverResponse, null, 2)}</pre>
          </div>`
        : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#F9FAFB;">

        <!-- Header -->
        <div style="background:#1F2937;border-radius:8px 8px 0 0;padding:20px 24px;">
          <h1 style="margin:0;color:#F9FAFB;font-size:20px;">🚨 Checkout Error Alert</h1>
          <p style="margin:4px 0 0;color:#9CA3AF;font-size:13px;">Trading Edge — Frontend Error Report</p>
        </div>

        <!-- Stage + message -->
        <div style="background:#fff;padding:20px 24px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
          <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:11px;font-weight:700;padding:3px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:.06em;">
            ${stage}
          </span>
          <p style="margin:14px 0 4px;font-size:17px;font-weight:700;color:#DC2626;">${errorMessage}</p>
          <p style="margin:0;font-size:12px;color:#9CA3AF;">
            Reported at: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })} (LK)
          </p>
        </div>

        <!-- User details -->
        <div style="background:#fff;padding:16px 24px;border:1px solid #E5E7EB;margin-top:2px;">
          <p style="margin:0 0 10px;font-weight:700;color:#111827;">👤 User Details</p>
          <table style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="padding:5px 10px;font-weight:600;color:#374151;width:120px;background:#F9FAFB;">Email</td>
              <td style="padding:5px 10px;color:#1D4ED8;">${userEmail || "—"}</td>
            </tr>
            <tr>
              <td style="padding:5px 10px;font-weight:600;color:#374151;background:#F9FAFB;">Name</td>
              <td style="padding:5px 10px;color:#374151;">${userName || "—"}</td>
            </tr>
            <tr>
              <td style="padding:5px 10px;font-weight:600;color:#374151;background:#F9FAFB;">Amount</td>
              <td style="padding:5px 10px;color:#374151;">${amount != null ? `$${amount} USD` : "—"}</td>
            </tr>
            <tr>
              <td style="padding:5px 10px;font-weight:600;color:#374151;background:#F9FAFB;">Discount</td>
              <td style="padding:5px 10px;color:#374151;">${discount != null ? `${discount}%` : "—"}</td>
            </tr>
            <tr>
              <td style="padding:5px 10px;font-weight:600;color:#374151;background:#F9FAFB;">Coupon</td>
              <td style="padding:5px 10px;color:#374151;">${couponCode || "—"}</td>
            </tr>
          </table>
        </div>

        ${fileSection}

        <!-- Device / Signal info -->
        ${signalRows
          ? `<div style="background:#fff;padding:16px 24px;border:1px solid #E5E7EB;margin-top:2px;">
              <p style="margin:0 0 10px;font-weight:700;color:#111827;">📡 Device &amp; Signal Info</p>
              <table style="border-collapse:collapse;width:100%;font-size:13px;">
                ${signalRows}
              </table>
            </div>`
          : ""}

        ${serverSection}

        <!-- Footer -->
        <div style="background:#1F2937;border-radius:0 0 8px 8px;padding:12px 24px;text-align:center;margin-top:2px;">
          <p style="margin:0;color:#6B7280;font-size:11px;">
            Automated alert · Trading Edge Checkout System
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Trading Edge Alerts" <${process.env.SMTP_USER}>`,
      to: alertTo,
      subject: `🚨 [${(stage ?? "unknown").toUpperCase()}] Checkout Error — ${userEmail || "unknown user"}`,
      html,
    });

    console.log(`✅ Frontend error alert sent to ${alertTo}`);
  } catch (err) {
    // Always swallow — we must return 200 so the user's checkout is unaffected
    console.error("❌ error-report endpoint failed:", err);
  }

  return NextResponse.json({ success: true });
}
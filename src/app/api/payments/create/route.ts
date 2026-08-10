import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// App Router segment config — replaces the deprecated `export const config = { api: { bodyParser: ... } }`
export const maxDuration = 60; // seconds
// Note: body size limit for App Router is controlled via next.config.js
// experimental.serverActions.bodySizeLimit — already set to "20mb" there.

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ─── Email transporter ────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Personal alert emailer ───────────────────────────────────────────────────
async function sendAlertEmail(options: {
  stage: string;
  errorMessage: string;
  userEmail?: string;
  userName?: string;
  amount?: number;
  discount?: number;
  couponCode?: string;
  fileName?: string;
  fileSize?: number;
  fileMime?: string;
  serverResponse?: unknown;
  signalInfo?: Record<string, unknown>;
  stackTrace?: string;
}) {
  try {
    const alertTo = process.env.ALERT_EMAIL;
    if (
      !alertTo ||
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn(
        "⚠️  ALERT_EMAIL or SMTP credentials missing — skipping alert",
      );
      return;
    }

    const transporter = createTransporter();
    const stageBadgeColor: Record<string, string> = {
      "send-code": "#F59E0B",
      verify: "#8B5CF6",
      coupon: "#3B82F6",
      "file-upload": "#EF4444",
      payment: "#DC2626",
    };
    const badgeColor = stageBadgeColor[options.stage] ?? "#6B7280";

    const signal = options.signalInfo ?? {};
    const signalRows = Object.entries(signal)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 8px;font-weight:600;color:#374151;white-space:nowrap;">${k}</td><td style="padding:4px 8px;color:#6B7280;word-break:break-all;">${v}</td></tr>`,
      )
      .join("");

    const fileSection = options.fileName
      ? `<div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 16px;margin:16px 0;border-radius:0 6px 6px 0;">
          <p style="margin:0 0 4px;font-weight:600;color:#92400E;">📎 File Info</p>
          <p style="margin:2px 0;color:#78350F;">Name: <code>${options.fileName}</code></p>
          <p style="margin:2px 0;color:#78350F;">Size: ${options.fileSize ? (options.fileSize / 1024).toFixed(1) + " KB" : "unknown"}</p>
          <p style="margin:2px 0;color:#78350F;">MIME: <code>${options.fileMime || "(empty)"}</code></p>
        </div>`
      : "";

    const serverSection =
      options.serverResponse !== undefined && options.serverResponse !== null
        ? `<div style="background:#F3F4F6;border-radius:6px;padding:12px 16px;margin:16px 0;">
          <p style="margin:0 0 6px;font-weight:600;color:#374151;">🖥️ Server Response</p>
          <pre style="margin:0;font-size:12px;color:#4B5563;overflow-x:auto;white-space:pre-wrap;">${JSON.stringify(options.serverResponse, null, 2)}</pre>
        </div>`
        : "";

    const stackSection = options.stackTrace
      ? `<div style="background:#FEE2E2;border-radius:6px;padding:12px 16px;margin:16px 0;">
          <p style="margin:0 0 6px;font-weight:600;color:#991B1B;">🔥 Stack Trace</p>
          <pre style="margin:0;font-size:11px;color:#7F1D1D;overflow-x:auto;white-space:pre-wrap;">${options.stackTrace}</pre>
        </div>`
      : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#F9FAFB;border-radius:10px;">
        <div style="background:#1F2937;border-radius:8px 8px 0 0;padding:20px 24px;">
          <h1 style="margin:0;color:#F9FAFB;font-size:18px;">🚨 Checkout Error Alert</h1>
          <p style="margin:4px 0 0;color:#9CA3AF;font-size:13px;">Trading Edge — Automated Error Report</p>
        </div>
        <div style="background:#fff;padding:16px 24px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
          <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:12px;font-weight:700;padding:3px 12px;border-radius:999px;text-transform:uppercase;">${options.stage}</span>
          <p style="margin:12px 0 0;font-size:16px;font-weight:600;color:#DC2626;">${options.errorMessage}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#9CA3AF;">Reported at: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })} (LK)</p>
        </div>
        <div style="background:#fff;padding:16px 24px;border:1px solid #E5E7EB;margin-top:2px;">
          <p style="margin:0 0 10px;font-weight:700;color:#111827;">👤 User Details</p>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:4px 8px;font-weight:600;color:#374151;">Email</td><td style="padding:4px 8px;color:#6B7280;">${options.userEmail || "—"}</td></tr>
            <tr style="background:#F9FAFB;"><td style="padding:4px 8px;font-weight:600;color:#374151;">Name</td><td style="padding:4px 8px;color:#6B7280;">${options.userName || "—"}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600;color:#374151;">Amount</td><td style="padding:4px 8px;color:#6B7280;">${options.amount != null ? `$${options.amount} USD` : "—"}</td></tr>
            <tr style="background:#F9FAFB;"><td style="padding:4px 8px;font-weight:600;color:#374151;">Discount</td><td style="padding:4px 8px;color:#6B7280;">${options.discount != null ? `${options.discount}%` : "—"}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600;color:#374151;">Coupon</td><td style="padding:4px 8px;color:#6B7280;">${options.couponCode || "—"}</td></tr>
          </table>
        </div>
        ${fileSection}
        ${signalRows ? `<div style="background:#fff;padding:16px 24px;border:1px solid #E5E7EB;margin-top:2px;"><p style="margin:0 0 10px;font-weight:700;color:#111827;">📡 Device & Signal Info</p><table style="border-collapse:collapse;width:100%;">${signalRows}</table></div>` : ""}
        ${serverSection}
        ${stackSection}
        <div style="background:#1F2937;border-radius:0 0 8px 8px;padding:12px 24px;text-align:center;">
          <p style="margin:0;color:#6B7280;font-size:11px;">Automated alert · Trading Edge Checkout System</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `"Trading Edge Alerts" <${process.env.SMTP_USER}>`,
      to: alertTo,
      subject: `🚨 [${options.stage.toUpperCase()}] Checkout Error — ${options.userEmail || "unknown user"}`,
      html,
    });

    console.log(
      `✅ Alert email sent to ${alertTo} for stage: ${options.stage}`,
    );
  } catch (alertErr) {
    console.error("❌ Failed to send alert email:", alertErr);
  }
}

// ─── File validation helpers (mobile-safe) ────────────────────────────────────
function getMimeTypeFromExtension(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function isValidFileExtension(fileName: string): boolean {
  return [".jpg", ".jpeg", ".png", ".pdf"].some((ext) =>
    fileName.toLowerCase().endsWith(ext),
  );
}

function isAcceptableMimeType(mimeType: string): boolean {
  return [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/octet-stream",
    "",
  ].includes(mimeType);
}

export async function POST(request: NextRequest) {
  console.log("🔥 POST /api/payments/create called");

  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const contentLength = request.headers.get("content-length");
  const contentLengthMB = contentLength
    ? (parseInt(contentLength) / 1024 / 1024).toFixed(2)
    : "unknown";

  console.log(`📦 Request size: ~${contentLengthMB}MB`);

  try {
    // ── Parse form data ────────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      const msg =
        parseError instanceof Error ? parseError.message : String(parseError);
      console.error("❌ FormData parse error:", parseError);
      await sendAlertEmail({
        stage: "file-upload",
        errorMessage: `Failed to parse form data — body too large? ~${contentLengthMB}MB. Error: ${msg}`,
        signalInfo: { userAgent, contentLengthMB },
        stackTrace: parseError instanceof Error ? parseError.stack : undefined,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Upload failed. Please try with a smaller file.",
        },
        { status: 413 },
      );
    }

    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;
    const amount = formData.get("amount") as string;
    const discount = formData.get("discount") as string;
    const couponCode = formData.get("couponCode") as string;
    const file = formData.get("slip") as File;
    const subscribe = formData.get("subscribe") as string;

    console.log("Extracted data:", {
      email,
      fullName,
      amount,
      discount,
      couponCode,
      fileName: file?.name,
      fileSize: file?.size,
      fileMime: file?.type,
    });

    // ── Required-field validation ──────────────────────────────────────────
    if (!email || !fullName || !amount || !file) {
      const msg = "Missing required fields";
      await sendAlertEmail({
        stage: "payment",
        errorMessage: msg,
        userEmail: email,
        userName: fullName,
        signalInfo: { userAgent },
      });
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 },
      );
    }

    const amountNum = parseFloat(amount);
    const discountNum = parseFloat(discount || "0");

    if (isNaN(amountNum)) {
      await sendAlertEmail({
        stage: "payment",
        errorMessage: `Invalid amount: "${amount}"`,
        userEmail: email,
        userName: fullName,
        signalInfo: { userAgent },
      });
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 },
      );
    }

    const finalAmount = amountNum - (amountNum * discountNum) / 100;

    // ── File handling ──────────────────────────────────────────────────────
    let slipUrl = "";
    if (file && file.size > 0) {
      try {
        const uploadsDir = path.join(process.cwd(), "public/uploads/slips");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // 1. Extension check
        if (!isValidFileExtension(file.name)) {
          const msg = `Invalid file extension: "${file.name}"`;
          await sendAlertEmail({
            stage: "file-upload",
            errorMessage: msg,
            userEmail: email,
            userName: fullName,
            fileName: file.name,
            fileSize: file.size,
            fileMime: file.type,
            signalInfo: { userAgent },
          });
          return NextResponse.json(
            {
              success: false,
              message: "Invalid file type. Please upload JPEG, PNG, or PDF.",
            },
            { status: 400 },
          );
        }

        // 2. MIME check (allow empty / octet-stream for mobile)
        if (file.type && !isAcceptableMimeType(file.type)) {
          const msg = `Unexpected MIME: "${file.type}" for "${file.name}"`;
          await sendAlertEmail({
            stage: "file-upload",
            errorMessage: msg,
            userEmail: email,
            userName: fullName,
            fileName: file.name,
            fileSize: file.size,
            fileMime: file.type,
            signalInfo: { userAgent },
          });
          return NextResponse.json(
            {
              success: false,
              message: "Invalid file type. Please upload JPEG, PNG, or PDF.",
            },
            { status: 400 },
          );
        }

        // 3. Size check — 10MB
        if (file.size > MAX_FILE_SIZE_BYTES) {
          const msg = `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (limit ${MAX_FILE_SIZE_MB}MB)`;
          await sendAlertEmail({
            stage: "file-upload",
            errorMessage: msg,
            userEmail: email,
            userName: fullName,
            fileName: file.name,
            fileSize: file.size,
            fileMime: file.type,
            signalInfo: { userAgent },
          });
          return NextResponse.json(
            {
              success: false,
              message: `File size should be less than ${MAX_FILE_SIZE_MB}MB.`,
            },
            { status: 400 },
          );
        }

        const resolvedMime =
          file.type && file.type !== "application/octet-stream"
            ? file.type
            : getMimeTypeFromExtension(file.name);

        console.log(
          `File OK — ${file.name} | ${(file.size / 1024).toFixed(0)}KB | ${resolvedMime}`,
        );

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadsDir, safeFileName);

        fs.writeFileSync(filePath, uint8Array);
        slipUrl = `/uploads/slips/${safeFileName}`;
        console.log("File saved:", slipUrl);
      } catch (fileError) {
        const msg =
          fileError instanceof Error ? fileError.message : String(fileError);
        console.error("File upload error:", fileError);
        await sendAlertEmail({
          stage: "file-upload",
          errorMessage: `File write error: ${msg}`,
          userEmail: email,
          userName: fullName,
          fileName: file?.name,
          fileSize: file?.size,
          fileMime: file?.type,
          stackTrace: fileError instanceof Error ? fileError.stack : undefined,
          signalInfo: { userAgent },
        });
        return NextResponse.json(
          { success: false, message: "Failed to upload file" },
          { status: 500 },
        );
      }
    }

    // ── Database record ────────────────────────────────────────────────────
    let payment: { id: string };
    try {
      payment = await prisma.payment.create({
        data: {
          email,
          fullName,
          amount: amountNum,
          discount: discountNum,
          finalAmount,
          couponCode: couponCode || null,
          slipUrl: slipUrl || null,
          status: "PENDING",
        },
      });
      console.log("Payment created:", payment.id);
    } catch (dbError) {
      const msg = dbError instanceof Error ? dbError.message : String(dbError);
      console.error("DB error:", dbError);
      await sendAlertEmail({
        stage: "payment",
        errorMessage: `Database error: ${msg}`,
        userEmail: email,
        userName: fullName,
        amount: amountNum,
        discount: discountNum,
        couponCode,
        fileName: file?.name,
        fileSize: file?.size,
        fileMime: file?.type,
        stackTrace: dbError instanceof Error ? dbError.stack : undefined,
        signalInfo: { userAgent },
      });
      return NextResponse.json(
        { success: false, message: "Failed to create payment record" },
        { status: 500 },
      );
    }

    // ── Admin notification email ───────────────────────────────────────────
    // ── Admin notification email ───────────────────────────────────────────
    try {
      if (
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
      ) {
        const transporter = createTransporter();
        const adminBaseUrl =
          process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
        const acceptUrl = `${adminBaseUrl}/api/payments/accept?paymentId=${payment.id}&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}`;

        // ── Slip attachment + inline image ──────────────────────────────
        const attachments: nodemailer.SendMailOptions["attachments"] = [];
        let slipHtmlSection = "";

        if (slipUrl) {
          const slipFilePath = path.join(process.cwd(), "public", slipUrl);
          const slipFileName = path.basename(slipFilePath);
          const slipMime = slipFileName.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : slipFileName.toLowerCase().endsWith(".png")
              ? "image/png"
              : "image/jpeg";

          const isImage = slipMime.startsWith("image/");

          attachments.push({
            filename: slipFileName,
            path: slipFilePath,
            cid: "bankslip@tradingedge", // Content-ID for inline use
          });

          slipHtmlSection = isImage
            ? `<div style="margin:20px 0;">
            <p style="font-weight:600;margin-bottom:8px;">📎 Bank Slip:</p>
            <img src="cid:bankslip@tradingedge" alt="Bank Slip" style="max-width:100%;border-radius:8px;border:1px solid #ddd;" />
          </div>`
            : `<div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:20px 0;">
            <p><strong>📄 Bank Slip (PDF):</strong> ${slipFileName} — attached above</p>
          </div>`;
        }
        // ────────────────────────────────────────────────────────────────

        await transporter.sendMail({
          from: `"Trading Edge" <${process.env.SMTP_USER}>`,
          to: "info@tradingedgefx.com", // ← updated
          subject: "New Payment Pending Approval",
          attachments,
          html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px;">
          <h2 style="color:#333;border-bottom:2px solid #4CAF50;padding-bottom:10px;">✅ New Payment Submitted</h2>
          <div style="margin:20px 0;">
            <p><strong>👤 User:</strong> ${fullName}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>💰 Amount:</strong> $${finalAmount.toFixed(2)} USD</p>
            <p><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${couponCode ? `<p><strong>🎫 Coupon:</strong> ${couponCode} (${discountNum}% off)</p>` : ""}
          </div>
          ${slipHtmlSection}
          <div style="text-align:center;margin:30px 0;">
            <a href="${acceptUrl}" style="background-color:#4CAF50;color:white;padding:14px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">
              ✅ Accept Payment & Create Student Account
            </a>
          </div>
          <div style="margin-top:20px;font-size:12px;color:#999;text-align:center;">
            <p>Payment ID: ${payment.id}</p>
          </div>
        </div>`,
        });
        console.log("Admin email sent");
      }
    } catch (emailError) {
      console.error("Admin email error:", emailError);
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: "Payment recorded successfully",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Unhandled error:", err);
    await sendAlertEmail({
      stage: "payment",
      errorMessage: `Unhandled exception: ${msg}`,
      signalInfo: { userAgent, contentLengthMB },
      stackTrace: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      { success: false, message: "Failed to create payment", error: msg },
      { status: 500 },
    );
  }
}

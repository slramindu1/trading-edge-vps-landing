"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Check, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Error Reporter ───────────────────────────────────────────────────────────
// Sends a detailed failure report to the owner's personal email via the
// /api/error-report endpoint whenever anything goes wrong for a user.
async function sendErrorReport(payload: {
  stage: string; // "send-code" | "verify" | "coupon" | "file-upload" | "payment"
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
}) {
  try {
    // Collect browser / device signal info automatically
    const signalInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || "direct",
      url: window.location.href,
    };

    await fetch("/api/error-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, signalInfo }),
    });
  } catch {
    // Silently swallow — we never want error reporting itself to break the UX
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [pin, setPin] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const isCardPaymentDisabled = true;

  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Resend timer
  const [canResendCode, setCanResendCode] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Form field states
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [totalAmount, setTotalAmount] = useState(117);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // Checkbox states
  const [subscribeChecked, setSubscribeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Timer for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && !canResendCode) {
      setCanResendCode(true);
    }
  }, [resendTimer, canResendCode]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Helper: MIME from extension (for mobile browsers that return empty/wrong MIME)
  const getMimeTypeFromExtension = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.endsWith(".pdf")) return "application/pdf";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    return "application/octet-stream";
  };

  // ── Send verification code ───────────────────────────────────────────────
  const handleSendCode = async () => {
    if (isSendingCode || !canResendCode) return;

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSendingCode(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Verification code sent to your email.");
        setIsCodeSent(true);
        setCanResendCode(false);
        setResendTimer(60);
      } else {
        toast.error(data.message || "Failed to send code.");
        await sendErrorReport({
          stage: "send-code",
          errorMessage: data.message || "Failed to send verification code",
          userEmail: email,
          serverResponse: data,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Error sending code. Please try again.");
      await sendErrorReport({
        stage: "send-code",
        errorMessage: `Network/fetch error: ${msg}`,
        userEmail: email,
        serverResponse: null,
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  // ── Verify code ──────────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (isVerifying) return;

    if (!pin || pin.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();

      if (data.success) {
        setIsEmailVerified(true);
        toast.success("Email address verified successfully.");
        // Only autofill name if it's a real name (not blank or placeholder)
        const returnedName = data.user?.name?.trim() || '';
        if (returnedName && returnedName.toLowerCase() !== 'guest user' && returnedName !== ' ') {
          setFullName(returnedName);
        }
      } else {
        toast.error(data.message || "Invalid or expired code.");
        await sendErrorReport({
          stage: "verify",
          errorMessage: data.message || "Invalid or expired verification code",
          userEmail: email,
          serverResponse: data,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Verification failed. Please try again.");
      await sendErrorReport({
        stage: "verify",
        errorMessage: `Network/fetch error: ${msg}`,
        userEmail: email,
        serverResponse: null,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Apply coupon ─────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (isApplyingCoupon) return;

    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const res = await fetch("/api/coupon/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();

      if (data.success) {
        setDiscountPercent(data.discount);
        const discounted = 117 - (117 * data.discount) / 100;
        setTotalAmount(Number(discounted.toFixed(2)));
        setIsCouponApplied(true);
        toast.success(`Coupon Applied! You saved ${data.discount}%`);
      } else {
        toast.error(data.message || "Invalid or expired coupon code.");
        await sendErrorReport({
          stage: "coupon",
          errorMessage: data.message || "Invalid or expired coupon code",
          userEmail: email,
          userName: fullName,
          couponCode,
          serverResponse: data,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Server error. Try again later.");
      await sendErrorReport({
        stage: "coupon",
        errorMessage: `Network/fetch error: ${msg}`,
        userEmail: email,
        userName: fullName,
        couponCode,
        serverResponse: null,
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setCouponCode("");
    setTotalAmount(117);
    setIsCouponApplied(false);
    toast.info("Coupon removed");
  };

  const handlePayWithCard = () => {
    toast.error("Card payments are not available. Please select Upload Slip.");
  };

  // ── File selection ───────────────────────────────────────────────────────
  const handleSlipUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    // Extension-based validation — mobile browsers (iOS Safari, Huawei EMUI)
    // often return empty string or wrong MIME type, so we check extension.
    const fileNameLower = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    const hasValidExtension = validExtensions.some((ext) =>
      fileNameLower.endsWith(ext),
    );

    if (!hasValidExtension) {
      toast.error("Please upload a JPEG, PNG, or PDF file.");
      await sendErrorReport({
        stage: "file-upload",
        errorMessage: `Invalid file extension: "${file.name}"`,
        userEmail: email,
        userName: fullName,
        fileName: file.name,
        fileSize: file.size,
        fileMime: file.type,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB.");
      await sendErrorReport({
        stage: "file-upload",
        errorMessage: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (limit 5MB)`,
        userEmail: email,
        userName: fullName,
        fileName: file.name,
        fileSize: file.size,
        fileMime: file.type,
      });
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    toast.info("Bank slip selected: " + file.name);
  };

  // ── Confirm bank payment ─────────────────────────────────────────────────
  const handleConfirmBankPayment = async () => {
    if (!selectedFile) {
      toast.error("Please select a bank slip to upload");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!termsChecked) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Mobile-safe file append: correct any wrong/missing MIME from mobile browsers
      const correctedMime =
        selectedFile.type && selectedFile.type !== "application/octet-stream"
          ? selectedFile.type
          : getMimeTypeFromExtension(selectedFile.name);

      const safeFile = new File(
        [selectedFile.slice(0, selectedFile.size, correctedMime)],
        selectedFile.name,
        { type: correctedMime },
      );

      formData.append("slip", safeFile);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("amount", "117");
      formData.append("discount", discountPercent.toString());
      formData.append("couponCode", isCouponApplied ? couponCode : "");
      formData.append("subscribe", subscribeChecked.toString());

      const response = await fetch("/api/payments/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        toast.success("Payment recorded successfully!");
        toast.success("Your account has been upgraded to PAID status.");
      } else {
        toast.error(data.message || "Failed to process payment");
        await sendErrorReport({
          stage: "payment",
          errorMessage: data.message || "Server rejected payment creation",
          userEmail: email,
          userName: fullName,
          amount: totalAmount,
          discount: discountPercent,
          couponCode: isCouponApplied ? couponCode : undefined,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileMime: correctedMime,
          serverResponse: data,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Error processing payment. Please try again.");
      await sendErrorReport({
        stage: "payment",
        errorMessage: `Network/fetch error during payment submission: ${msg}`,
        userEmail: email,
        userName: fullName,
        amount: totalAmount,
        discount: discountPercent,
        couponCode: isCouponApplied ? couponCode : undefined,
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        fileMime: selectedFile?.type,
        serverResponse: null,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="min-h-screen p-4 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20">
          {/* Product Info */}
          <div className="space-y-3 flex flex-col order-2 md:order-1">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/assets/checkout.svg"
                alt="Photon Pro"
                width={800}
                height={400}
                className="rounded-lg object-cover w-full"
                priority
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Trading Edge 1 Year Pro Membership
              </h1>
              <p className="text-foreground">
                One-time payment = 1 Year Access
              </p>

              <div className="flex items-center gap-2">
                <p className="text-foreground">
                  All future course updates included
                </p>
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>

              <ul className="list-disc pl-5 space-y-1 text-foreground">
                <li>Trading Edge Course</li>
                <li>Trading Edge Flix</li>
                <li>Trading Edge Community</li>
                <li>Daily Market Outlook</li>
                <li>180+ Training Videos</li>
                <li>Mindset Room</li>
                <li>Trade Setups</li>
                <li>Weekly Strategy Sessions</li>
                <li>In-Depth Trade Reviews</li>
                <li>1-on-1 Mentor Messaging</li>
                <li>Live Q&A Calls</li>
                <li>Complete Profesional Toolset</li>
              </ul>
            </div>
          </div>

          {/* Checkout Form */}
          <Card className="p-4 bg-card text-card-foreground order-2 md:order-2 md:p-6 border-blue-400">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  <span
                    className={`inline-block transition-all duration-500 ease-in-out ${
                      isCouponApplied ? "line-through text-white scale-90" : ""
                    }`}
                  >
                    $117 USD
                  </span>
                </h2>

                <div className="border-t border-border mt-4 pt-4">
                  {isCouponApplied && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-foreground">Subtotal:</span>
                        <span className="text-foreground">$117</span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-foreground">Discount:</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-blue-500 font-semibold">
                            -{discountPercent}% ($
                            {((117 * discountPercent) / 100).toFixed(2)})
                          </span>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-blue-500 hover:text-blue-600 text-xl font-bold px-2"
                            title="Remove Discount"
                          >
                            &times;
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-border">
                        <span className="text-foreground">Due Now:</span>
                        <span className="text-foreground">
                          ${totalAmount} USD
                        </span>
                      </div>
                    </>
                  )}

                  {!isCouponApplied && (
                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2 mt-2">
                      <span className="text-foreground">Discount:</span>
                      <div className="ml-auto flex items-center gap-2 w-full md:justify-end">
                        <Input
                          type="text"
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          className="bg-black text-white border rounded-md px-2 py-1 text-sm w-full h-9 md:w-72"
                          disabled={isApplyingCoupon}
                        />
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                          disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                          {isApplyingCoupon ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Applying
                            </>
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form className="space-y-4 text-white">
                {/* Email Verification */}
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailEntered(!!e.target.value);
                      setIsEmailVerified(false);
                      setIsCodeSent(false);
                      setPin("");
                      setCanResendCode(true);
                      setResendTimer(0);
                    }}
                    className={isEmailVerified ? "pr-10 border-green-500" : ""}
                    disabled={isEmailVerified}
                  />
                  {isEmailVerified && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>

                {isEmailEntered && !isEmailVerified && (
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Input
                      type="text"
                      placeholder="6-digit verification code"
                      value={pin}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setPin(value);
                      }}
                      maxLength={6}
                      className="text-center tracking-widest"
                    />
                    <Button
                      onClick={isCodeSent ? handleVerify : handleSendCode}
                      type="button"
                      className="w-full sm:w-auto min-w-[100px]"
                      disabled={
                        (isCodeSent &&
                          (isVerifying || !pin || pin.length !== 6)) ||
                        (!isCodeSent && (isSendingCode || !canResendCode))
                      }
                    >
                      {isSendingCode ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isCodeSent ? (
                        isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Verify"
                        )
                      ) : canResendCode ? (
                        "Get Code"
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resendTimer}s
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                {/* Fields disabled until verified */}
                <fieldset
                  disabled={!isEmailVerified}
                  className={!isEmailVerified ? "opacity-50" : ""}
                >
                  <Input
                    id="name"
                    placeholder="Full Name"
                    className="mb-4"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    id="address1"
                    placeholder="Address Line 1"
                    className="mb-4"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                  <Input
                    id="city"
                    placeholder="City"
                    className="mb-4"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select onValueChange={setState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CB">Colombo</SelectItem>
                        <SelectItem value="GM">Gampaha</SelectItem>
                        <SelectItem value="KL">Kalutara</SelectItem>
                        <SelectItem value="KD">Kandy</SelectItem>
                        <SelectItem value="MT">Matale</SelectItem>
                        <SelectItem value="NR">Nuwara Eliya</SelectItem>
                        <SelectItem value="GL">Galle</SelectItem>
                        <SelectItem value="MTL">Matara</SelectItem>
                        <SelectItem value="HB">Hambantota</SelectItem>
                        <SelectItem value="JA">Jaffna</SelectItem>
                        <SelectItem value="KLN">Kilinochchi</SelectItem>
                        <SelectItem value="MN">Mannar</SelectItem>
                        <SelectItem value="VT">Vavuniya</SelectItem>
                        <SelectItem value="ML">Mullaitivu</SelectItem>
                        <SelectItem value="BT">Batticaloa</SelectItem>
                        <SelectItem value="AM">Ampara</SelectItem>
                        <SelectItem value="TR">Trincomalee</SelectItem>
                        <SelectItem value="KM">Kurunegala</SelectItem>
                        <SelectItem value="PT">Puttalam</SelectItem>
                        <SelectItem value="AN">Anuradhapura</SelectItem>
                        <SelectItem value="PO">Polonnaruwa</SelectItem>
                        <SelectItem value="BD">Badulla</SelectItem>
                        <SelectItem value="MO">Monaragala</SelectItem>
                        <SelectItem value="RG">Ratnapura</SelectItem>
                        <SelectItem value="KE">Kegalle</SelectItem>
                        <SelectItem value="OT">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="zip"
                      placeholder="Zip/Postal Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="font-semibold text-foreground">
                      Payment Method
                    </div>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2 border border-border rounded-md p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 border border-border rounded-md p-3 mt-2">
                        <RadioGroupItem value="slip" id="slip" />
                        <Label htmlFor="slip">Upload Slip</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "slip" && (
                    <div className="space-y-4">
                      <Label>Upload Bank Payment Slip</Label>
                      <Input
                        type="file"
                        onChange={handleSlipUpload}
                        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,image/jpg,application/pdf"
                      />
                      {fileName && (
                        <p className="text-sm text-green-500">
                          Selected: {fileName}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        Accepted: JPG, PNG, PDF (Max 5MB)
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="font-semibold mb-2">Bank Details:</p>
                        <p>Account Name: U.G.Dhanuka Prasad Chandrarathna</p>
                        <p>Bank: Commercial Bank</p>
                        <p>Acc No: 8023105603</p>
                        <p>Branch: Dambulla</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribe"
                        checked={subscribeChecked}
                        onCheckedChange={(checked) =>
                          setSubscribeChecked(checked as boolean)
                        }
                      />
                      <Label htmlFor="subscribe" className="text-sm">
                        Subscribe to our email list.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsChecked}
                        onCheckedChange={(checked) =>
                          setTermsChecked(checked as boolean)
                        }
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions.
                      </Label>
                    </div>
                  </div>

                  <div className="mt-4">
                    {paymentMethod === "card" && (
                      <Button
                        className="w-full opacity-50 cursor-not-allowed"
                        type="button"
                        onClick={handlePayWithCard}
                      >
                        Pay With Card
                      </Button>
                    )}

                    {paymentMethod === "slip" && (
                      <Button
                        className="w-full"
                        type="button"
                        onClick={handleConfirmBankPayment}
                        disabled={
                          isUploading ||
                          uploadSuccess ||
                          !selectedFile ||
                          !fullName.trim() ||
                          !email.trim() ||
                          !termsChecked
                        }
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : uploadSuccess ? (
                          "Payment Successful!"
                        ) : (
                          "Confirm Bank Payment"
                        )}
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

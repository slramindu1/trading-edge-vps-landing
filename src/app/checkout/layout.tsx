import { Footer, Navbar } from "@/components";
import React from "react";
import Script from "next/script";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <>
      {/* ✅ PayHere SDK එක load කරන්න */}
      <Script
        src="https://www.payhere.lk/lib/payhere.js"
        strategy="beforeInteractive"
      />

      <div className="flex flex-col items-center w-full">
        {/* <Navbar /> */}
        {children}
        <Footer />
      </div>
    </>
  );
};

export default MarketingLayout;

import { Footer, Navbar } from "@/components";
import { SITE_CONFIG } from "@/config";
import { cn } from "@/lib/utils";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const font = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = SITE_CONFIG;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.tradingedgefx.com/#organization",
      "name": "Trading Edge",
      "url": "https://www.tradingedgefx.com",
      "logo": "https://www.tradingedgefx.com/logos/icon_logo.png",
      "description": "Trading Edge is a comprehensive Forex trading educational program in Sri Lanka, taught in Sinhala medium. Learn from experienced mentors how to become a consistent, profitable FX trader.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK"
      },
      "sameAs": [
        "https://lms.tradingedgefx.com"
      ]
    },
    {
      "@type": "Course",
      "@id": "https://www.tradingedgefx.com/#course",
      "name": "Trading Edge Forex Trading Course",
      "description": "A comprehensive Forex (FX) trading course taught in Sinhala. Learn mechanical trading systems, risk management, and technical analysis from experienced mentors. No prior experience required.",
      "url": "https://www.tradingedgefx.com",
      "provider": {
        "@type": "EducationalOrganization",
        "@id": "https://www.tradingedgefx.com/#organization"
      },
      "inLanguage": "si",
      "educationalLevel": "Beginner to Advanced",
      "courseMode": "Online",
      "availableLanguage": "Sinhala",
      "offers": {
        "@type": "Offer",
        "category": "Forex Trading Education",
        "url": "https://www.tradingedgefx.com/#pricing",
        "priceCurrency": "LKR",
        "availability": "https://schema.org/InStock"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "inLanguage": "si"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.tradingedgefx.com/#website",
      "url": "https://www.tradingedgefx.com",
      "name": "Trading Edge",
      "description": "Learn Forex Trading in Sri Lanka - Sinhala Medium Online Course",
      "publisher": {
        "@type": "EducationalOrganization",
        "@id": "https://www.tradingedgefx.com/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden",
          font.className
        )}
      >
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

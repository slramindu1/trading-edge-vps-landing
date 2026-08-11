import React from "react";
import { RenderSectionClient } from "./RenderSectionClient";
import Image from "next/image";
import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

async function getSectionData(key: string) {
  try {
    let lmsUrl = process.env.INTERNAL_LMS_URL || process.env.NEXT_PUBLIC_LMS_URL || "http://localhost:3000";
    let res = await fetch(`${lmsUrl}/api/public/builder?key=${key}`, { cache: 'no-store' });
    
    // If it fails and we are using default, try 3001 (in case LMS is on 3001)
    if (!res.ok && !process.env.NEXT_PUBLIC_LMS_URL) {
      lmsUrl = "http://localhost:3001";
      res = await fetch(`${lmsUrl}/api/public/builder?key=${key}`, { cache: 'no-store' });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Failed to fetch builder section ${key}:`, errText);
      return { error: true, details: `HTTP ${res.status}: ${errText}` };
    }
    return res.json();
  } catch (e: any) {
    console.error("Error fetching builder section:", e);
    return { error: true, details: e.message || "Fetch failed" };
  }
}

export async function RenderSection({ sectionKey }: { sectionKey: string }) {
  const data = await getSectionData(sectionKey);
  const isError = !data || data.error;
  const errorDetails = data?.details || (data?.error && typeof data.error === 'string' ? data.error : "Unknown error");
  
  if (isError) {
    if (sectionKey === "landing-testimonials") {
      return (
        <Wrapper id="results">
          <script dangerouslySetInnerHTML={{ __html: `console.error("RenderSection Server Error for ${sectionKey}:", ${JSON.stringify(errorDetails)});` }} />
          <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10"></div>
          <Container className="flex flex-col items-center justify-center">
            <div className="max-w-md mx-auto text-center">
              <SectionBadge title="Our Result" />
              <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                We worked with thousands of amazing people
              </h2>
              <p className="text-muted-foreground mt-6">
                You Can Read And Understand Our Student Comments
              </p>
            </div>
          </Container>

          <Container className="mt-16">
            <section className="use-automation-zoom-in py-10 px-4">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {[
                  "/5.jpg",
                  "/new3.jpg",
                  "/new7.jpg",
                  "/4.jpg",
                  "/new10.jpg",
                  "/new13.jpg",
                  "/new1.jpg",
                  "/new4.jpg",
                  "/new5.jpg",
                  "/new8.jpg",
                  "/new11.jpg",
                  "/11.jpg",
                  "/new2.jpg",
                  "/new6.jpg",
                  "/new9.jpg",
                  "/new12.jpg",
                  "/new14.jpg",
                ].map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl shadow-lg mb-4 break-inside-avoid group relative"
                  >
                    <img
                      src={src}
                      alt={`Image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          </Container>
        </Wrapper>
      );
    }

    return (
      <div className="w-full py-10 text-center text-muted-foreground">
        Builder section {sectionKey} not found. Please create it in the admin panel.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center overflow-hidden py-10">
      <RenderSectionClient data={data} />
    </div>
  );
}

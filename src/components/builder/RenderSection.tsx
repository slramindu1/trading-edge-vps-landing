import React from "react";
import { RenderSectionClient } from "./RenderSectionClient";
import Image from "next/image";
import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

async function getSectionData(key: string) {
  try {
    let lmsUrl = process.env.NEXT_PUBLIC_LMS_URL || "http://localhost:3000";
    let res = await fetch(`${lmsUrl}/api/public/builder?key=${key}`, { cache: 'no-store' });
    
    // If it fails and we are using default, try 3001 (in case LMS is on 3001)
    if (!res.ok && !process.env.NEXT_PUBLIC_LMS_URL) {
      lmsUrl = "http://localhost:3001";
      res = await fetch(`${lmsUrl}/api/public/builder?key=${key}`, { cache: 'no-store' });
    }

    if (!res.ok) {
      console.error("Failed to fetch builder section", key);
      return null;
    }
    return res.json();
  } catch (e) {
    console.error("Error fetching builder section on 3000:", e);
    // If connection refused, try 3001
    try {
      if (!process.env.NEXT_PUBLIC_LMS_URL) {
        const res2 = await fetch(`http://localhost:3001/api/public/builder?key=${key}`, { cache: 'no-store' });
        if (res2.ok) return res2.json();
      }
    } catch (err) {}
    return null;
  }
}

export async function RenderSection({ sectionKey }: { sectionKey: string }) {
  const data = await getSectionData(sectionKey);
  
  if (!data || data.error) {
    if (sectionKey === "landing-testimonials") {
      return (
        <Wrapper id="results">
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
                  "/assets/5.jpg",
                  "/assets/new3.jpg",
                  "/assets/new7.jpg",
                  "/assets/4.jpg",
                  "/assets/new10.jpg",
                  "/assets/new13.jpg",
                  "/assets/new1.jpg",
                  "/assets/new4.jpg",
                  "/assets/new5.jpg",
                  "/assets/new8.jpg",
                  "/assets/new11.jpg",
                  "/assets/11.jpg",
                  "/assets/new2.jpg",
                  "/assets/new6.jpg",
                  "/assets/new9.jpg",
                  "/assets/new12.jpg",
                  "/assets/new14.jpg",
                ].map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl shadow-lg mb-4 break-inside-avoid group relative"
                  >
                    <Image
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

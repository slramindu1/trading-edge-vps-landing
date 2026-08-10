"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export function RenderSectionClient({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const elements = typeof data.elements === "string" ? JSON.parse(data.elements) : data.elements;
  const canvasW = data.canvasW || 1200;
  const canvasH = data.canvasH || 800;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Find the width of the parent container to scale down proportionally
        const parentW = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        if (parentW < canvasW) {
          setScale(parentW / canvasW);
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasW]);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    
    // If it doesn't start with a slash, it's a legacy asset name like 'new3.jpg'
    if (!url.startsWith("/")) {
      return `/assets/${url}`;
    }

    if (url.startsWith("/assets/")) {
      return url;
    }

    // Uploaded images (/uploads/...) live in the LMS project.
    const lmsUrl = process.env.NEXT_PUBLIC_LMS_URL || "http://localhost:3000";
    return `${lmsUrl}${url}`;
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center overflow-hidden" style={{ height: canvasH * scale }}>
      <div 
        className="relative origin-top-left"
        style={{ width: canvasW, height: canvasH, transform: `scale(${scale})` }}
      >
        {elements.filter((el: any) => el.visible !== false).map((el: any) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              opacity: el.opacity ?? 1,
              zIndex: el.zIndex ?? 1,
              borderRadius: el.borderRadius ?? 0,
              boxShadow: el.shadow ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "none",
              overflow: "hidden",
              transform: `rotate(${el.rotation || 0}deg)`,
              borderWidth: el.borderWidth || 0,
              borderColor: el.borderColor || "transparent",
              borderStyle: el.borderStyle || "solid",
            }}
          >
             {el.type === "text" && (
                <p style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color, textAlign: el.textAlign, margin: 0, width: '100%', height: '100%', letterSpacing: el.letterSpacing, lineHeight: el.lineHeight }}>
                  {el.text}
                </p>
              )}
              {el.type === "heading" && (
                <h2 style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color, textAlign: el.textAlign, margin: 0, lineHeight: el.lineHeight || 1.2, width: '100%', height: '100%', letterSpacing: el.letterSpacing }}>
                  {el.text}
                </h2>
              )}
              {el.type === "button" && (
                <div style={{ backgroundColor: el.backgroundColor, borderRadius: el.borderRadius, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color }}>
                    {el.text}
                  </span>
                </div>
              )}
              {el.type === "image" && el.imageUrl && (
                <img src={getImageUrl(el.imageUrl)} alt="Builder Image" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: el.borderRadius }} />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

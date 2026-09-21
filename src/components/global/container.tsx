"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
    className?: string;
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
}

const Container = ({ children, className, delay = 0.2, reverse }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hasHydrated, setHasHydrated] = useState(false);
    const [viewportStatus, setViewportStatus] = useState("Not in viewport");
    const [animationStatus, setAnimationStatus] = useState("Not started");

    useEffect(() => {
        setHasHydrated(true);

        const timer = setTimeout(async () => {
            if (ref.current) {
                const computedStyle = window.getComputedStyle(ref.current);
                const opacity = computedStyle.getPropertyValue("opacity");
                const visibility = computedStyle.getPropertyValue("visibility");

                if (opacity === "0" || visibility === "hidden") {
                    console.error("Text loading stuck at opacity 0! Sending debug report...");
                    
                    const debugData = {
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                        hydrationState: hasHydrated ? "Hydrated" : "Not Hydrated",
                        viewportStatus: viewportStatus,
                        animationStatus: animationStatus,
                        computedOpacity: opacity,
                        computedVisibility: visibility,
                        className: className || "No class"
                    };

                    try {
                        await fetch("/api/send-debug-report", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(debugData)
                        });
                        console.log("Debug report sent successfully.");
                    } catch (err) {
                        console.error("Failed to send debug report", err);
                    }
                }
            }
        }, 3000); // Check 3 seconds after mount

        return () => clearTimeout(timer);
    }, [hasHydrated, viewportStatus, animationStatus, className]);

    return (
        <motion.div
            ref={ref}
            className={cn("w-full h-full", className)}
            initial={{ opacity: 0, y: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.4, ease: "easeInOut" }}
            onViewportEnter={() => setViewportStatus("Entered Viewport")}
            onViewportLeave={() => setViewportStatus("Left Viewport")}
            onAnimationStart={() => setAnimationStatus("Animation Started")}
            onAnimationComplete={() => setAnimationStatus("Animation Completed")}
        >
            {children}
        </motion.div>
    );
};

export default Container;
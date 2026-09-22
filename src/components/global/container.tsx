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
                // Get physical position on the screen
                const rect = ref.current.getBoundingClientRect();
                // Check if element is currently inside the visible window area
                const isInPhysicalViewport = rect.top < window.innerHeight && rect.bottom > 0;

                const computedStyle = window.getComputedStyle(ref.current);
                const opacity = computedStyle.getPropertyValue("opacity");
                const visibility = computedStyle.getPropertyValue("visibility");

                // ONLY trigger bug report if it's physically on screen BUT stuck at opacity 0
                if (isInPhysicalViewport && (opacity === "0" || visibility === "hidden")) {
                    console.warn("Text loading stuck at opacity 0! Applying emergency fallback...");

                    // EMERGENCY FALLBACK: Force the content to appear
                    ref.current.style.opacity = "1";
                    ref.current.style.visibility = "visible";
                    ref.current.style.transform = "translateY(0)";
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
            viewport={{ once: true, margin: "100px", amount: "some" }}
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
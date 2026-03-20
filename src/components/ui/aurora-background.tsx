"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export function AuroraBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -inset-[10px] opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(15, 23, 42, 0.5), transparent),
              radial-gradient(ellipse 60% 40% at 70% 50%, rgba(59, 130, 246, 0.15), transparent),
              radial-gradient(ellipse 50% 30% at 30% 60%, rgba(15, 23, 42, 0.3), transparent)
            `,
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: [
              "0% 0%",
              "100% 100%",
              "0% 0%",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      {children}
    </div>
  );
}

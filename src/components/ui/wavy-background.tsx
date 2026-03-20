"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function WavyBackground({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="wavyPattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 50 Q50 0 100 50 T200 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            <path
              d="M0 100 Q50 50 100 100 T200 100"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
            />
            <path
              d="M0 150 Q50 100 100 150 T200 150"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wavyPattern)" />
      </svg>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

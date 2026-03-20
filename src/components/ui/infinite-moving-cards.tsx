"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  className,
}: {
  items: { title: string; url?: string; difficulty?: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    const speedMap = { fast: "15s", normal: "25s", slow: "40s" };
    containerRef.current.style.setProperty(
      "--animation-duration",
      speedMap[speed]
    );
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-10 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 gap-3 py-2",
          start && "animate-moving"
        )}
        style={{
          animationDuration: "var(--animation-duration, 25s)",
          animationDirection: "var(--animation-direction, forwards)",
        }}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex-shrink-0 rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-1.5"
          >
            <span className="text-xs text-[#ededed]">{item.title}</span>
            {item.difficulty && (
              <span
                className={cn(
                  "ml-2 text-xs",
                  item.difficulty === "Easy" && "text-[#22c55e]",
                  item.difficulty === "Medium" && "text-[#eab308]",
                  item.difficulty === "Hard" && "text-[#ef4444]"
                )}
              >
                {item.difficulty}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

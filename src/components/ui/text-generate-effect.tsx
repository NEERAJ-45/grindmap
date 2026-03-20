"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const wordArray = words.split(" ");

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    wordArray.forEach((_, i) => {
      const timeout = setTimeout(() => {
        setDisplayedWords((prev) => [...prev, wordArray[i]]);
      }, i * 40);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  return (
    <span className={cn("inline-flex flex-wrap gap-x-1.5", className)}>
      {wordArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={
            idx < displayedWords.length
              ? { opacity: 1, filter: "blur(0px)" }
              : {}
          }
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

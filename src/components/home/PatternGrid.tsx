"use client";

import { PatternCard } from "./PatternCard";
import { motion } from "framer-motion";

interface PatternGridProps {
  patterns: {
    name: string;
    slug: string;
    icon: string;
    problems: {
      difficulty: string;
      users: { userId: string; done: boolean; solvedOn: Date | null }[];
    }[];
  }[];
  userId: string | null;
}

export function PatternGrid({ patterns, userId }: PatternGridProps) {
  return (
    <div
      id="patterns"
      className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {patterns.map((pattern, index) => (
        <motion.div
          key={pattern.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
        >
          <PatternCard pattern={pattern} userId={userId} />
        </motion.div>
      ))}
    </div>
  );
}

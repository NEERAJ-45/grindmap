"use client";

import { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsRow } from "@/components/home/StatsRow";
import { FilterBar } from "@/components/home/FilterBar";
import { PatternGrid } from "@/components/home/PatternGrid";
import { BroadcastBanner } from "@/components/shared/BroadcastBanner";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { useFingerprint } from "@/hooks/useFingerprint";
import { calculateStreak } from "@/lib/streak";
import { motion } from "framer-motion";

interface HomeClientProps {
  patterns: {
    name: string;
    slug: string;
    icon: string;
    problems: {
      id: number;
      difficulty: string;
      users: { userId: string; done: boolean; solvedOn: Date | null }[];
    }[];
  }[];
}

export default function HomeClient({ patterns }: HomeClientProps) {
  const userId = useFingerprint();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const totalProblems = patterns.reduce((a, p) => a + p.problems.length, 0);

  const solvedProblems = userId
    ? patterns.reduce(
        (a, p) =>
          a +
          p.problems.filter((pr) =>
            pr.users.some((u) => u.userId === userId && u.done)
          ).length,
        0
      )
    : 0;

  const solvedDates = userId
    ? patterns
        .flatMap((p) => p.problems)
        .flatMap((pr) => pr.users)
        .filter((u) => u.userId === userId && u.done && u.solvedOn)
        .map((u) => new Date(u.solvedOn!))
    : [];

  const { currentStreak } = calculateStreak(solvedDates);

  // Filter patterns
  let filtered = patterns;
  if (filter !== "all" && userId) {
    if (filter === "solved") {
      filtered = patterns.filter((p) =>
        p.problems.every((pr) =>
          pr.users.some((u) => u.userId === userId && u.done)
        )
      );
    } else if (filter === "unsolved") {
      filtered = patterns.filter((p) =>
        p.problems.some(
          (pr) => !pr.users.some((u) => u.userId === userId && u.done)
        )
      );
    } else {
      const diffMap: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
      const diff = diffMap[filter];
      if (diff) {
        filtered = patterns.filter((p) =>
          p.problems.some((pr) => pr.difficulty === diff)
        );
      }
    }
  }

  // Sort patterns
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "progress") {
      const aProgress = userId
        ? a.problems.filter((pr) =>
            pr.users.some((u) => u.userId === userId && u.done)
          ).length / Math.max(a.problems.length, 1)
        : 0;
      const bProgress = userId
        ? b.problems.filter((pr) =>
            pr.users.some((u) => u.userId === userId && u.done)
          ).length / Math.max(b.problems.length, 1)
        : 0;
      return bProgress - aProgress;
    }
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fixed right-6 top-4 z-40">
        <GlobalSearch />
      </div>

      <HeroSection />
      <BroadcastBanner />
      <StatsRow
        totalProblems={totalProblems}
        solved={solvedProblems}
        pending={totalProblems - solvedProblems}
        streak={currentStreak}
      />
      <FilterBar
        activeFilter={filter}
        sortBy={sortBy}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
      />
      <PatternGrid patterns={sorted} userId={userId} />
    </motion.div>
  );
}

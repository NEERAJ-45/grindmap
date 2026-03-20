"use client";

import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type LucideIconName = keyof typeof LucideIcons;

interface PatternCardProps {
  pattern: {
    name: string;
    slug: string;
    icon: string;
    problems: {
      difficulty: string;
      users: { userId: string; done: boolean; solvedOn: Date | null }[];
    }[];
  };
  userId: string | null;
}

export function PatternCard({ pattern, userId }: PatternCardProps) {
  const total = pattern.problems.length;
  const solved = userId
    ? pattern.problems.filter((p) =>
        p.users.some((u) => u.userId === userId && u.done)
      ).length
    : 0;
  const progress = total > 0 ? (solved / total) * 100 : 0;
  const isComplete = solved === total && total > 0;

  const easy = pattern.problems.filter((p) => p.difficulty === "Easy").length;
  const medium = pattern.problems.filter((p) => p.difficulty === "Medium").length;
  const hard = pattern.problems.filter((p) => p.difficulty === "Hard").length;

  // Last solved
  const userSolves = userId
    ? pattern.problems
        .flatMap((p) => p.users)
        .filter((u) => u.userId === userId && u.done && u.solvedOn)
        .map((u) => new Date(u.solvedOn!))
        .sort((a, b) => b.getTime() - a.getTime())
    : [];

  const lastSolved = userSolves[0];

  const IconComponent = (LucideIcons[pattern.icon as LucideIconName] as LucideIcons.LucideIcon) || LucideIcons.Layers;

  return (
    <Link href={`/patterns/${pattern.slug}`}>
      <div
        className={cn(
          "rounded-lg border bg-[#111] p-4 transition-colors hover:border-[#2f2f2f]",
          isComplete
            ? "border-[#22c55e]/30"
            : "border-[#1f1f1f]"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent size={16} strokeWidth={1.5} className="text-[#6b7280]" />
            <span className="text-sm font-medium">{pattern.name}</span>
          </div>
          <span className="text-xs text-[#6b7280]">
            {solved} / {total}
          </span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#1f1f1f]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isComplete ? "bg-[#22c55e]" : "bg-[#3b82f6]"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex gap-2 text-xs">
          {easy > 0 && <span className="text-[#22c55e]">{easy} Easy</span>}
          {medium > 0 && (
            <span className="text-[#eab308]">{medium} Medium</span>
          )}
          {hard > 0 && <span className="text-[#ef4444]">{hard} Hard</span>}
        </div>

        <p className="mt-2 text-xs text-[#6b7280]">
          {lastSolved
            ? `Last solved ${formatDistanceToNow(lastSolved, { addSuffix: true })}`
            : "Not started"}
        </p>
      </div>
    </Link>
  );
}

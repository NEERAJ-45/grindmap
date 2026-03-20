"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { ProblemsTable } from "@/components/patterns/ProblemsTable";
import { SmartPasteBox } from "@/components/patterns/SmartPasteBox";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { BroadcastBanner } from "@/components/shared/BroadcastBanner";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Download, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type LucideIconName = keyof typeof LucideIcons;

interface PatternPageClientProps {
  pattern: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    problems: {
      id: number;
      srNo: number;
      title: string;
      url: string;
      difficulty: string;
      tags: string;
      users: { userId: string; done: boolean; solvedOn: Date | null; notes: string | null }[];
    }[];
  };
}

export default function PatternPageClient({ pattern }: PatternPageClientProps) {
  const userId = useFingerprint();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight")
    ? parseInt(searchParams.get("highlight")!)
    : undefined;

  const total = pattern.problems.length;
  const solved = userId
    ? pattern.problems.filter((p) =>
        p.users.some((u) => u.userId === userId && u.done)
      ).length
    : 0;
  const progress = total > 0 ? (solved / total) * 100 : 0;

  const IconComponent =
    (LucideIcons[pattern.icon as LucideIconName] as LucideIcons.LucideIcon) ||
    LucideIcons.Layers;

  const existingUrls = pattern.problems.map((p) => p.url);

  // CSV export
  const handleExport = () => {
    const headers = ["Sr", "Title", "URL", "Difficulty", "Tags", "Solved"];
    const rows = pattern.problems.map((p) => {
      const isDone = userId
        ? p.users.some((u) => u.userId === userId && u.done)
        : false;
      return [
        p.srNo,
        `"${p.title}"`,
        p.url,
        p.difficulty,
        `"${JSON.parse(p.tags).join(", ")}"`,
        isDone ? "Yes" : "No",
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pattern.slug}-problems.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suggestedProblems = [
    { title: "Two Sum", difficulty: "Easy" },
    { title: "Valid Parentheses", difficulty: "Easy" },
    { title: "Merge Intervals", difficulty: "Medium" },
    { title: "LRU Cache", difficulty: "Medium" },
    { title: "Word Search II", difficulty: "Hard" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fixed right-6 top-4 z-40">
        <GlobalSearch />
      </div>

      <BroadcastBanner />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="mb-4 inline-block text-xs text-[#6b7280] transition-colors hover:text-[#ededed]"
          >
            ← Back to patterns
          </Link>

          <div className="flex items-center gap-3">
            <IconComponent size={20} strokeWidth={1.5} className="text-[#6b7280]" />
            <TextGenerateEffect
              words={pattern.name}
              className="text-3xl font-medium tracking-tight"
            />
          </div>

          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-[#6b7280]">
              {solved} / {total} solved
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-[#1f1f1f]">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  progress === 100 ? "bg-[#22c55e]" : "bg-[#3b82f6]"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2">
              {/* Tag filter pills would go here */}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-md border border-[#1f1f1f] bg-transparent px-3 py-1.5 text-sm text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
            >
              <Download size={14} strokeWidth={1.5} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Smart Paste Box */}
        <SmartPasteBox
          patternId={pattern.id}
          patternName={pattern.name}
          existingUrls={existingUrls}
        />

        {/* Problems Table or Empty State */}
        {pattern.problems.length > 0 ? (
          <ProblemsTable
            problems={pattern.problems}
            userId={userId}
            patternName={pattern.name}
            highlightId={highlightId}
          />
        ) : (
          <div className="flex flex-col items-center py-16">
            <Inbox size={48} strokeWidth={1} className="text-[#6b7280]" />
            <p className="mt-4 text-sm font-medium">No problems yet</p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Use the paste box above to add problems.
            </p>
            <button
              onClick={() => {
                // Trigger expand of SmartPasteBox
              }}
              className="mt-4 rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#e5e5e5]"
            >
              Add Problems
            </button>
            <div className="mt-8 w-full max-w-2xl">
              <InfiniteMovingCards items={suggestedProblems} speed="slow" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

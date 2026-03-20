"use client";

import { Flame } from "lucide-react";

interface StatsRowProps {
  totalProblems: number;
  solved: number;
  pending: number;
  streak: number;
}

export function StatsRow({ totalProblems, solved, pending, streak }: StatsRowProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex divide-x divide-[#1f1f1f]">
        <StatBlock label="Total Problems" value={totalProblems} />
        <StatBlock label="You Solved" value={solved} />
        <StatBlock label="Pending" value={pending} />
        <div className="flex flex-1 flex-col items-center gap-1 px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-medium">{streak}</span>
            <Flame
              size={14}
              strokeWidth={1.5}
              className={streak > 0 ? "text-[#ef4444]" : "text-[#6b7280]"}
            />
          </div>
          <span className="text-xs text-[#6b7280]">Current Streak</span>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-4">
      <span className="text-2xl font-medium">{value}</span>
      <span className="text-xs text-[#6b7280]">{label}</span>
    </div>
  );
}

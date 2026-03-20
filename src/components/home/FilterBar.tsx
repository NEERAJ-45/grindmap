"use client";

import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeFilter: string;
  sortBy: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

const filters = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Unsolved", value: "unsolved" },
  { label: "Solved", value: "solved" },
];

export function FilterBar({
  activeFilter,
  sortBy,
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#1f1f1f] px-6 py-3">
      <div className="flex gap-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "text-sm transition-colors",
              activeFilter === f.value
                ? "text-white underline underline-offset-4"
                : "text-[#6b7280] hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-1.5 text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
      >
        <option value="name">Sort: Name</option>
        <option value="progress">Sort: Progress</option>
        <option value="lastActive">Sort: Last Active</option>
      </select>
    </div>
  );
}

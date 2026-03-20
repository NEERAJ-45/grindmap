"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ContributionHeatmapProps {
  solveCounts: Record<string, number>;
}

export function ContributionHeatmap({ solveCounts }: ContributionHeatmapProps) {
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    const weeks: { date: string; count: number; day: number }[][] = [];
    const months: { label: string; col: number }[] = [];

    // Build 52 weeks
    for (let w = 51; w >= 0; w--) {
      const week: { date: string; count: number; day: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = date.toISOString().split("T")[0];
        week.push({
          date: key,
          count: solveCounts[key] || 0,
          day: date.getDay(),
        });
      }
      weeks.push(week);

      // Month labels
      const firstDay = new Date(today);
      firstDay.setDate(firstDay.getDate() - w * 7);
      if (firstDay.getDate() <= 7) {
        months.push({
          label: firstDay.toLocaleString("default", { month: "short" }),
          col: 51 - w,
        });
      }
    }

    return { weeks, months };
  }, [solveCounts]);

  const getColor = (count: number) => {
    if (count === 0) return "#161616";
    if (count <= 2) return "#1d3a5f";
    if (count <= 5) return "#1e4d8c";
    if (count <= 9) return "#2563eb";
    return "#3b82f6";
  };

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="ml-8 flex gap-[2px]">
        {months.map((m, i) => (
          <div
            key={i}
            className="text-xs text-[#6b7280]"
            style={{
              position: "relative",
              left: `${m.col * 12.5}px`,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] pt-0">
          {["", "M", "", "W", "", "F", ""].map((label, i) => (
            <div
              key={i}
              className="flex h-[10px] w-6 items-center text-xs text-[#6b7280]"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date} — ${cell.count} solved`}
                  className="h-[10px] w-[10px] rounded-sm"
                  style={{ backgroundColor: getColor(cell.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

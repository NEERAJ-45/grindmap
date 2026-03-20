"use client";

import { useEffect, useState } from "react";
import { useFingerprint } from "@/hooks/useFingerprint";
import { getUserStats } from "@/app/actions";
import { calculateStreak } from "@/lib/streak";
import { ContributionHeatmap } from "@/components/stats/ContributionHeatmap";
import { WavyBackground } from "@/components/ui/wavy-background";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { BroadcastBanner } from "@/components/shared/BroadcastBanner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";

const CHART_COLORS = ["#22c55e", "#eab308", "#ef4444"];
const tooltipStyle = {
  contentStyle: { background: "#111", border: "1px solid #1f1f1f", fontSize: 12, borderRadius: 6 },
  itemStyle: { color: "#ededed" },
};

export default function StatsPageClient() {
  const userId = useFingerprint();
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getUserStats>> | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUserStats(userId).then(setStats);
  }, [userId]);

  if (!userId || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-md bg-[#1a1a1a]" />
      </div>
    );
  }

  const { currentStreak, bestStreak } = calculateStreak(
    stats.solvedDates.map((d) => new Date(d))
  );

  const diffData = [
    { name: "Easy", value: stats.easy, color: "#22c55e" },
    { name: "Medium", value: stats.medium, color: "#eab308" },
    { name: "Hard", value: stats.hard, color: "#ef4444" },
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
        <Link
          href="/"
          className="mb-4 inline-block text-xs text-[#6b7280] transition-colors hover:text-[#ededed]"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-medium tracking-tight">Your Progress</h1>

        {/* Overview Row */}
        <div className="mt-6 flex divide-x divide-[#1f1f1f] rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          {[
            { label: "Total Solved", value: stats.solved },
            { label: "This Week", value: stats.thisWeek },
            { label: "Today", value: stats.today },
            { label: "Best Streak", value: bestStreak },
          ].map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-1 px-4">
              <span className="text-2xl font-medium">{item.value}</span>
              <span className="text-xs text-[#6b7280]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <WavyBackground containerClassName="mt-8 rounded-lg border border-[#1f1f1f] bg-[#111] p-6">
          <h2 className="mb-4 text-sm font-medium">Solve Activity</h2>
          <ContributionHeatmap solveCounts={stats.solveCounts} />
        </WavyBackground>

        {/* Charts Row */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Bar — Solved per pattern */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">By Pattern</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.patternProgress} layout="vertical">
                <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#6b7280", fontSize: 11 }} width={100} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="solved" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line — Daily solves */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">Daily Solves (30d)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailySolves}>
                <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={{ r: 2, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — Difficulty distribution */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">Difficulty Split</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={diffData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {diffData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ededed"
                  fontSize={20}
                  fontWeight={500}
                >
                  {stats.solved}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Progress Table */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-medium">Pattern Progress</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Pattern</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Solved</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Total</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Progress</th>
                <th className="px-3 py-2 text-right text-xs uppercase tracking-wider text-[#6b7280]">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.patternProgress
                .sort((a, b) => {
                  const aP = a.total > 0 ? a.solved / a.total : 0;
                  const bP = b.total > 0 ? b.solved / b.total : 0;
                  return bP - aP;
                })
                .map((p) => {
                  const pct = p.total > 0 ? Math.round((p.solved / p.total) * 100) : 0;
                  return (
                    <tr key={p.slug} className="border-b border-[#1f1f1f] hover:bg-[#141414]">
                      <td className="px-3 py-2.5">
                        <Link href={`/patterns/${p.slug}`} className="text-sm hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-sm">{p.solved}</td>
                      <td className="px-3 py-2.5 text-sm text-[#6b7280]">{p.total}</td>
                      <td className="px-3 py-2.5">
                        <div className="h-1 w-24 overflow-hidden rounded-full bg-[#1f1f1f]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              pct === 100 ? "bg-[#22c55e]" : "bg-[#3b82f6]"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right text-sm text-[#6b7280]">{pct}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

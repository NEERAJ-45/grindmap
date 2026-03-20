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
  LineChart, Line, CartesianGrid, AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";

const CHART_COLORS = ["#22c55e", "#eab308", "#ef4444"];
const DOMAIN_COLORS = {
  DSA: "#22c55e",
  "System Design": "#a855f7",
  Tasks: "#3b82f6",
  Projects: "#f97316"
};

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

        {/* Overview Row 1: DSA */}
        <div className="mt-6 flex divide-x divide-[#1f1f1f] rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          {[
            { label: "DSA Solved", value: stats.solved },
            { label: "DSA This Week", value: stats.thisWeek },
            { label: "DSA Today", value: stats.today },
            { label: "Best DSA Streak", value: bestStreak },
          ].map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-1 px-4">
              <span className="text-2xl font-medium">{item.value}</span>
              <span className="text-xs text-[#6b7280]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Overview Row 2: Breakout Domains */}
        <div className="mt-4 flex divide-x divide-[#1f1f1f] rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          {[
            { label: "System Design Items", value: stats.sdCompleted, color: "text-[#a855f7]" },
            { label: "Tasks Completed", value: stats.tasksCompleted, color: "text-[#3b82f6]" },
            { label: "Projects Completed", value: stats.projectsCompleted, color: "text-[#f97316]" },
          ].map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-1 px-4">
              <span className={cn("text-2xl font-medium", item.color)}>{item.value}</span>
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
          {/* Area — Combined Daily Activity */}
          <div className="col-span-1 md:col-span-2 rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">Activity by Domain (30d)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.combinedDaily}>
                <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="dsa" stackId="1" stroke={DOMAIN_COLORS["DSA"]} fill={DOMAIN_COLORS["DSA"]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="system_design" stackId="1" stroke={DOMAIN_COLORS["System Design"]} fill={DOMAIN_COLORS["System Design"]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="task" stackId="1" stroke={DOMAIN_COLORS["Tasks"]} fill={DOMAIN_COLORS["Tasks"]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="project" stackId="1" stroke={DOMAIN_COLORS["Projects"]} fill={DOMAIN_COLORS["Projects"]} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — Domain distribution */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">Domain Focus</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.domainDist.filter((d: { value: number; name: string }) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.domainDist.map((entry: { name: string; value: number }, i: number) => (
                    <Cell key={i} fill={DOMAIN_COLORS[entry.name as keyof typeof DOMAIN_COLORS]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar — Solved per pattern */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">DSA Pattern Progress</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.patternProgress}>
                <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} height={60} tickMargin={35} angle={-45} textAnchor="end" />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="solved" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
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

"use client";

import { useEffect, useState } from "react";
import { getAdminAnalytics } from "@/app/actions";
import { ContributionHeatmap } from "@/components/stats/ContributionHeatmap";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

const tooltipStyle = {
  contentStyle: { background: "#111", border: "1px solid #1f1f1f", fontSize: 12, borderRadius: 6 },
  itemStyle: { color: "#ededed" },
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminAnalytics>> | null>(null);

  useEffect(() => {
    getAdminAnalytics().then(setData);
  }, []);

  if (!data) {
    return <div className="grid grid-cols-2 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-60 animate-pulse rounded-lg bg-[#1a1a1a]" />)}</div>;
  }

  const funnelData = [
    { name: "Total Users", value: data.funnel.totalUsers },
    { name: "Solved 1+", value: data.funnel.solved1Plus },
    { name: "Solved 5+", value: data.funnel.solved5Plus },
    { name: "Solved 10+", value: data.funnel.solved10Plus },
  ];

  const bucketData = Object.entries(data.buckets).map(([bucket, count]) => ({ bucket, count: count as number }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="relative">
      <h1 className="text-2xl font-medium tracking-tight mb-6">Analytics</h1>

      {/* Row 1: DAU + Daily Solves */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Daily Active Users (14d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.dau}>
              <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Problems Solved/Day (30d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.dailySolves}>
              <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Most/Least Solved + Solve Rate */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Most Solved (Top 10)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.mostSolved} layout="vertical">
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis dataKey="title" type="category" tick={{ fill: "#6b7280", fontSize: 10 }} width={120} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="solves" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Least Solved (Bottom 10)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.leastSolved} layout="vertical">
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis dataKey="title" type="category" tick={{ fill: "#6b7280", fontSize: 10 }} width={120} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="solves" fill="#6b7280" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Solve Rate by Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.patternSolveRates}>
              <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Donut + Funnel */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{ name: "Easy", value: data.diffDist.Easy }, { name: "Medium", value: data.diffDist.Medium }, { name: "Hard", value: data.diffDist.Hard }]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                <Cell fill="#22c55e" />
                <Cell fill="#eab308" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">User Solve Buckets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bucketData}>
              <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
              <XAxis dataKey="bucket" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Platform Heatmap */}
      <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-6">
        <h3 className="mb-4 text-sm font-medium">Platform Activity</h3>
        <ContributionHeatmap solveCounts={data.platformHeatmap} />
      </div>
    </motion.div>
  );
}

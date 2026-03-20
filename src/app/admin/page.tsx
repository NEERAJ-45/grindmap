"use client";

import { useEffect, useState } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";
import { Users, CheckSquare, Activity, Layers, List, Plus, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";
import { formatDistanceToNow } from "date-fns";

const tooltipStyle = {
  contentStyle: { background: "#111", border: "1px solid #1f1f1f", fontSize: 12, borderRadius: 6 },
  itemStyle: { color: "#ededed" },
};

interface AdminStats {
  totalUsers: number;
  solvedToday: number;
  activeToday: number;
  totalPatterns: number;
  totalProblems: number;
}

interface ActivityItem {
  id: number;
  userId: string;
  action: string;
  problemTitle: string | null;
  patternName: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/admin/activity").then((r) => r.json()).then(setActivity);

    const interval = setInterval(() => {
      fetch("/api/admin/activity").then((r) => r.json()).then(setActivity);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-[#1a1a1a]" />
        ))}
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers },
    { icon: CheckSquare, label: "Solved Today", value: stats.solvedToday },
    { icon: Activity, label: "Active Today", value: stats.activeToday },
    { icon: Layers, label: "Total Patterns", value: stats.totalPatterns },
    { icon: List, label: "Total Problems", value: stats.totalProblems },
  ];

  const actionIcons: Record<string, { icon: typeof CheckSquare; color: string }> = {
    solve: { icon: CheckSquare, color: "text-[#22c55e]" },
    add: { icon: Plus, color: "text-[#3b82f6]" },
    new_user: { icon: UserPlus, color: "text-[#6b7280]" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="mb-6 text-2xl font-medium tracking-tight">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        {statCards.map((card) => (
          <CardSpotlight key={card.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-medium">{card.value}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{card.label}</p>
              </div>
              <card.icon size={18} strokeWidth={1.5} className="text-[#6b7280]" />
            </div>
          </CardSpotlight>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-[65%_35%] gap-6">
        {/* Left — Charts */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
            <h3 className="mb-4 text-sm font-medium">Activity Overview</h3>
            <div className="flex h-48 items-center justify-center text-xs text-[#6b7280]">
              Charts load with analytics data
            </div>
          </div>
        </div>

        {/* Right — Live Feed */}
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
          <h3 className="mb-4 text-sm font-medium">Live Activity</h3>
          <div className="relative max-h-[400px] overflow-y-auto">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#111] to-transparent" />
            <div className="space-y-2">
              {activity.map((item) => {
                const { icon: Icon, color } = actionIcons[item.action] || actionIcons.solve;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Icon size={14} strokeWidth={1.5} className={color} />
                    <span className="text-[#6b7280]">
                      User #{item.userId.slice(0, 5)}
                    </span>
                    <span>
                      {item.action === "solve"
                        ? "solved"
                        : item.action === "add"
                        ? "added problems"
                        : "joined"}
                    </span>
                    {item.problemTitle && (
                      <span className="font-medium">{item.problemTitle}</span>
                    )}
                    <span className="ml-auto text-xs text-[#6b7280]">
                      · {formatDistanceToNow(new Date(item.createdAt), { addSuffix: false })}
                    </span>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <p className="text-xs text-[#6b7280]">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

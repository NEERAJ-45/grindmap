"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[0];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    getAdminUsers({ active: activeFilter || undefined }).then(setUsers);
  }, [activeFilter]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <h1 className="text-2xl font-medium tracking-tight mb-6">Users</h1>

      <div className="flex gap-3 mb-4">
        {["", "today", "week", "month"].map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className={cn("text-sm px-3 py-1 rounded-md border transition-colors", activeFilter === f ? "border-[#3b82f6] text-white bg-[#1d3a5f]/30" : "border-[#1f1f1f] text-[#6b7280] hover:text-white")}>
            {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">User ID</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">First Seen</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Last Active</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Solved</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Patterns</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Streak</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Avg/Day</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} onClick={() => setSelectedUser(u)} className="border-b border-[#1f1f1f] hover:bg-[#141414] cursor-pointer">
              <td className="px-3 py-2.5 text-sm font-mono text-[#6b7280]">{u.id.slice(0, 12)}...</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{format(new Date(u.firstSeen), "MMM d, yyyy")}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{format(new Date(u.lastActive), "MMM d, yyyy")}</td>
              <td className="px-3 py-2.5 text-sm">{u.solved}</td>
              <td className="px-3 py-2.5 text-sm">{u.patternsStarted}</td>
              <td className="px-3 py-2.5 text-sm">{u.streak}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{u.avgPerDay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={() => setSelectedUser(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.2 }} className="fixed right-0 top-0 z-50 h-screen w-[480px] border-l border-[#1f1f1f] bg-[#0d0d0d] p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-[#6b7280] hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-4 mb-6">
                <div><p className="text-xs text-[#6b7280]">User ID</p><p className="text-sm font-mono">{selectedUser.id}</p></div>
                <div><p className="text-xs text-[#6b7280]">First Seen</p><p className="text-sm">{format(new Date(selectedUser.firstSeen), "MMM d, yyyy")}</p></div>
                <div><p className="text-xs text-[#6b7280]">Last Active</p><p className="text-sm">{format(new Date(selectedUser.lastActive), "MMM d, yyyy HH:mm")}</p></div>
              </div>

              <h3 className="text-sm font-medium mb-3">Solve History</h3>
              <table className="w-full">
                <thead><tr className="border-b border-[#1f1f1f]">
                  <th className="text-left px-2 py-1.5 text-xs uppercase text-[#6b7280]">Problem</th>
                  <th className="text-left px-2 py-1.5 text-xs uppercase text-[#6b7280]">Pattern</th>
                  <th className="text-left px-2 py-1.5 text-xs uppercase text-[#6b7280]">Date</th>
                </tr></thead>
                <tbody>
                  {selectedUser.solveHistory.map((h, i) => (
                    <tr key={i} className="border-b border-[#1f1f1f]">
                      <td className="px-2 py-1.5 text-sm">{h.problem}</td>
                      <td className="px-2 py-1.5 text-sm text-[#6b7280]">{h.pattern}</td>
                      <td className="px-2 py-1.5 text-xs text-[#6b7280]">{h.date ? format(new Date(h.date), "MMM d") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminProblems, getPatterns, deleteProblem, deleteProblems, updateProblem } from "@/app/actions";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AdminProblem = Awaited<ReturnType<typeof getAdminProblems>>[0];

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [patterns, setPatterns] = useState<Awaited<ReturnType<typeof getPatterns>>>([]);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filterPattern, setFilterPattern] = useState<number | undefined>();
  const [filterDiff, setFilterDiff] = useState<string | undefined>();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const loadData = () => {
    getAdminProblems({ search: search || undefined, patternId: filterPattern, difficulty: filterDiff }).then(setProblems);
    getPatterns().then(setPatterns);
  };

  useEffect(() => { loadData(); }, [search, filterPattern, filterDiff]);

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteProblem(id);
      loadData();
      toast.success("Problem deleted");
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} problems?`)) return;
    startTransition(async () => {
      await deleteProblems(Array.from(selected));
      setSelected(new Set());
      loadData();
      toast.success(`${selected.size} problems deleted`);
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium tracking-tight">Problems</h1>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-md border border-[#1f1f1f] bg-[#111] pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterPattern ?? ""} onChange={(e) => setFilterPattern(e.target.value ? Number(e.target.value) : undefined)} className="rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-1.5 text-sm focus:outline-none">
          <option value="">All Patterns</option>
          {patterns.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterDiff ?? ""} onChange={(e) => setFilterDiff(e.target.value || undefined)} className="rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-1.5 text-sm focus:outline-none">
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} className="flex items-center gap-1.5 rounded-md border border-[#ef4444]/30 px-3 py-1.5 text-sm text-[#ef4444] hover:bg-[#ef4444]/10">
            <Trash2 size={14} /> Delete {selected.size}
          </button>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            <th className="w-8 px-3 py-2"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelected(new Set(problems.map((p) => p.id))); else setSelected(new Set()); }} className="accent-[#3b82f6]" /></th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Sr</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Pattern</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Problem</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Difficulty</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Solved</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Rate</th>
            <th className="w-10 px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p.id} className="border-b border-[#1f1f1f] hover:bg-[#141414]">
              <td className="px-3 py-2.5"><input type="checkbox" checked={selected.has(p.id)} onChange={(e) => { const s = new Set(selected); e.target.checked ? s.add(p.id) : s.delete(p.id); setSelected(s); }} className="accent-[#3b82f6]" /></td>
              <td className="px-3 py-2.5 text-xs text-[#6b7280]">{p.srNo}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{p.patternName}</td>
              <td className="px-3 py-2.5"><a href={p.url} target="_blank" rel="noopener" className="text-sm hover:underline">{p.title}</a></td>
              <td className="px-3 py-2.5"><span className={cn("text-xs font-medium", p.difficulty === "Easy" ? "text-[#22c55e]" : p.difficulty === "Medium" ? "text-[#eab308]" : p.difficulty === "Hard" ? "text-[#ef4444]" : "text-[#6b7280]")}>{p.difficulty}</span></td>
              <td className="px-3 py-2.5 text-sm">{p.usersSolved}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{p.solveRate}%</td>
              <td className="px-3 py-2.5"><button onClick={() => handleDelete(p.id)} className="text-[#ef4444] opacity-0 group-hover:opacity-100 hover:text-[#ef4444]/80"><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

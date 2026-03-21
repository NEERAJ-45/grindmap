"use client";

import { useEffect, useState, useTransition } from "react";
import { getPatterns, createPattern, deletePattern } from "@/app/actions";
import { Pencil, Plus, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconPicker } from "@/components/ui/IconPicker";
import * as LucideIcons from "lucide-react";

export default function AdminPatternsPage() {
  const [patterns, setPatterns] = useState<Awaited<ReturnType<typeof getPatterns>>>([]);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [newPattern, setNewPattern] = useState({ name: "", icon: "", slug: "" });

  useEffect(() => {
    getPatterns().then(setPatterns);
  }, []);

  const handleCreate = () => {
    const slug = newPattern.slug || newPattern.name.toLowerCase().replace(/\s+/g, "-");
    startTransition(async () => {
      await createPattern({ name: newPattern.name, slug, icon: newPattern.icon || "Layers" });
      const updated = await getPatterns();
      setPatterns(updated);
      toast.success("Pattern created");
      setShowModal(false);
      setNewPattern({ name: "", icon: "", slug: "" });
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this pattern and all its problems?")) return;
    startTransition(async () => {
      await deletePattern(id);
      const updated = await getPatterns();
      setPatterns(updated);
      toast.success("Pattern deleted");
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium tracking-tight">Patterns</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm text-black hover:bg-[#e5e5e5]">
          <Plus size={14} strokeWidth={1.5} /> New Pattern
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Icon</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Name</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Slug</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Problems</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patterns.map((p) => (
            <tr key={p.id} className="border-b border-[#1f1f1f] hover:bg-[#141414]">
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">
                {(() => {
                  const Icon = (LucideIcons as any)[p.icon] || HelpCircle;
                  return <Icon size={16} strokeWidth={1.5} />;
                })()}
              </td>
              <td className="px-3 py-2.5 text-sm">{p.name}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{p.slug}</td>
              <td className="px-3 py-2.5 text-sm">{p.problems.length}</td>
              <td className="px-3 py-2.5">
                <div className="flex gap-2">
                  <Link href={`/patterns/${p.slug}`} className="text-[#6b7280] hover:text-[#ededed]">
                    <Pencil size={14} strokeWidth={1.5} />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="text-[#ef4444] hover:text-[#ef4444]/80">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#1f1f1f] bg-[#111] p-6">
            <h2 className="text-lg font-medium mb-4">New Pattern</h2>
            <div className="space-y-3">
              <input value={newPattern.name} onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="Name" className="w-full rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" />
              <IconPicker value={newPattern.icon} onChange={(icon) => setNewPattern({ ...newPattern, icon })} className="w-full" />
              <input value={newPattern.slug} onChange={(e) => setNewPattern({ ...newPattern, slug: e.target.value })} placeholder="Slug (auto-generated)" className="w-full rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-2 text-sm text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" />
              <button onClick={handleCreate} disabled={!newPattern.name || isPending} className="w-full rounded-md bg-white px-4 py-2 text-sm text-black hover:bg-[#e5e5e5] disabled:opacity-50">
                Create Pattern
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

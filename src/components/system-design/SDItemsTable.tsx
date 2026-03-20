"use client";

import { useState, useCallback } from "react";
import { toggleSDItemDone, updateSDNotes } from "@/app/actions/sd-actions";
import { type SDItem, type UserSDItem } from "@prisma/client";
import { Check, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SDItemsTableProps {
  items: (SDItem & { users: UserSDItem[] })[];
  userId: string;
}

export function SDItemsTable({ items, userId }: SDItemsTableProps) {
  // Optimistic state: tracks items whose done status has been flipped locally
  const [optimisticDone, setOptimisticDone] = useState<Record<string, boolean>>({});
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const isDone = useCallback(
    (item: SDItem & { users: UserSDItem[] }) => {
      if (item.id in optimisticDone) return optimisticDone[item.id];
      return item.users.some((u) => u.userId === userId && u.done);
    },
    [optimisticDone, userId]
  );

  const handleToggle = (itemId: string, currentDone: boolean) => {
    // Flip instantly in local state
    const newDone = !currentDone;
    setOptimisticDone((prev) => ({ ...prev, [itemId]: newDone }));

    // Fire server action in the background — revert on failure
    toggleSDItemDone(userId, itemId, newDone).catch(() => {
      setOptimisticDone((prev) => ({ ...prev, [itemId]: currentDone }));
    });
  };

  const saveNotes = async (itemId: string) => {
    if (editingNotes !== itemId) return;
    await updateSDNotes(userId, itemId, notesValue);
    setEditingNotes(null);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy": return "text-emerald-400 bg-emerald-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "hard": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111]">
      <table className="w-full text-left text-sm text-[#8b92a0]">
        <thead className="border-b border-[#1f1f1f] bg-[#0d0d0d] text-xs uppercase text-[#6b7280]">
          <tr>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Resource</th>
            <th className="px-6 py-4 font-medium">Type</th>
            <th className="px-6 py-4 font-medium">Difficulty</th>
            <th className="px-6 py-4 font-medium text-right">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1f1f1f]">
          {items.map((item) => {
            const userState = item.users.find((u) => u.userId === userId);
            const itemDone = isDone(item);
            const isEditing = editingNotes === item.id;

            return (
              <tr key={item.id} className="transition-colors hover:bg-[#151515]">
                {/* Status Checkbox */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(item.id, itemDone)}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md border transition-all",
                      itemDone
                        ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                        : "border-[#333] hover:border-[#444]"
                    )}
                  >
                    {itemDone ? <Check size={14} strokeWidth={3} /> : null}
                  </button>
                </td>

                {/* Title & Link */}
                <td className="px-6 py-4 font-medium text-[#ededed]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#3b82f6] transition-colors"
                  >
                    {item.title}
                    <ExternalLink size={14} className="text-[#4b5563]" />
                  </a>
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <span className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1 text-xs text-[#a3a3a3]">
                    {item.type}
                  </span>
                </td>

                {/* Difficulty */}
                <td className="px-6 py-4">
                  <span className={cn("rounded-md px-2 py-1 text-xs font-medium inline-flex", getDifficultyColor(item.difficulty))}>
                    {item.difficulty}
                  </span>
                </td>

                {/* Notes */}
                <td className="px-6 py-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveNotes(item.id);
                          if (e.key === "Escape") setEditingNotes(null);
                        }}
                        onBlur={() => saveNotes(item.id)}
                        className="w-48 rounded bg-[#1a1a1a] px-2 py-1 text-sm text-[#ededed] outline-none border border-[#333] focus:border-[#3b82f6]"
                        placeholder="Add notes..."
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setNotesValue(userState?.notes || "");
                        setEditingNotes(item.id);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                        userState?.notes
                          ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                          : "text-[#6b7280] hover:bg-[#1a1a1a] hover:text-[#ededed]"
                      )}
                    >
                      <FileText size={14} />
                      {userState?.notes ? "View/Edit" : "Add note"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

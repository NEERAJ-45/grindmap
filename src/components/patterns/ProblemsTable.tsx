"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleProblemDone, updateNotes, updateSolvedDate, deleteProblem } from "@/app/actions";
import { format } from "date-fns";
import { ExternalLink, NotepadText, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Problem {
  id: number;
  srNo: number;
  title: string;
  url: string;
  difficulty: string;
  tags: string;
  users: { userId: string; done: boolean; solvedOn: Date | null; notes: string | null }[];
}

interface ProblemsTableProps {
  problems: Problem[];
  userId: string | null;
  patternName: string;
  highlightId?: number;
}

export function ProblemsTable({ problems, userId, patternName, highlightId }: ProblemsTableProps) {
  const [isPending, startTransition] = useTransition();
  const [openNotes, setOpenNotes] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleToggle = (problemId: number, currentDone: boolean) => {
    if (!userId) return;
    startTransition(async () => {
      await toggleProblemDone(userId, problemId, !currentDone);
      toast.success(!currentDone ? "Problem solved!" : "Unmarked");
    });
  };

  const handleDeleteProblem = (id: number) => {
    startTransition(async () => {
      await deleteProblem(id);
      toast.success("Problem deleted");
    });
    setOpenMenu(null);
  };

  const handleSaveNotes = (problemId: number) => {
    if (!userId) return;
    startTransition(async () => {
      await updateNotes(userId, problemId, noteText);
    });
    setOpenNotes(null);
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Sr</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Done</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Problem</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Difficulty</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Tags</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Solved On</th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-[#6b7280]">Notes</th>
            <th className="w-10 px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => {
            const userProblem = userId
              ? problem.users.find((u) => u.userId === userId)
              : null;
            const isDone = userProblem?.done ?? false;
            const solvedOn = userProblem?.solvedOn;
            const hasNotes = !!userProblem?.notes;
            const isHighlighted = highlightId === problem.id;
            const tags: string[] = JSON.parse(problem.tags || "[]");

            return (
              <motion.tr
                key={problem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className={cn(
                  "group border-b border-[#1f1f1f] transition-colors hover:bg-[#0f0f0f]",
                  isDone && "bg-[#0d0d0d]",
                  isHighlighted && "animate-pulse bg-[#1d3a5f]/20"
                )}
              >
                <td className="px-3 py-2.5 text-xs text-[#6b7280]">{problem.srNo}</td>
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => handleToggle(problem.id, isDone)}
                    disabled={!userId || isPending}
                    className="h-4 w-4 rounded border-[#1f1f1f] bg-[#111] accent-[#3b82f6]"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1 text-sm hover:underline",
                      isDone && "text-[#6b7280] line-through"
                    )}
                  >
                    {problem.title}
                    <ExternalLink
                      size={12}
                      strokeWidth={1.5}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      problem.difficulty === "Easy" && "text-[#22c55e]",
                      problem.difficulty === "Medium" && "text-[#eab308]",
                      problem.difficulty === "Hard" && "text-[#ef4444]",
                      problem.difficulty === "Unknown" && "text-[#6b7280]"
                    )}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm bg-[#1a1a1a] px-2 py-0.5 text-xs text-[#ededed]"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className="text-xs text-[#6b7280]">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs text-[#6b7280]">
                  {solvedOn ? format(new Date(solvedOn), "MMM d, yyyy") : "—"}
                </td>
                <td className="relative px-3 py-2.5">
                  <button
                    onClick={() => {
                      setOpenNotes(openNotes === problem.id ? null : problem.id);
                      setNoteText(userProblem?.notes || "");
                    }}
                    className="transition-colors"
                  >
                    <NotepadText
                      size={14}
                      strokeWidth={1.5}
                      className={hasNotes ? "text-[#ededed]" : "text-[#6b7280]"}
                    />
                  </button>
                  {openNotes === problem.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-lg border border-[#1f1f1f] bg-[#111] p-3">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onBlur={() => handleSaveNotes(problem.id)}
                        placeholder="Add notes..."
                        className="h-24 w-full resize-none rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-2 text-sm text-[#ededed] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                        autoFocus
                      />
                    </div>
                  )}
                </td>
                <td className="relative px-3 py-2.5">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === problem.id ? null : problem.id)
                    }
                    className="text-[#6b7280] opacity-0 transition-all group-hover:opacity-100 hover:text-[#ededed]"
                  >
                    <MoreHorizontal size={14} strokeWidth={1.5} />
                  </button>
                  {openMenu === problem.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 rounded-lg border border-[#1f1f1f] bg-[#111] py-1">
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#ef4444] hover:bg-[#1a1a1a]"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                        Delete row
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

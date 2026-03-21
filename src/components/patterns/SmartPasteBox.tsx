"use client";

import { useState, useTransition } from "react";
import { Plus, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parsePaste } from "@/lib/parsePaste";
import { toast } from "sonner";

interface SmartPasteBoxProps {
  patternId: number;
  patternName: string;
  existingUrls: string[];
}

export function SmartPasteBox({ patternId, patternName, existingUrls }: SmartPasteBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<
    { srNo: number; title: string; url: string; slug: string; difficulty: string; tags: string; isDuplicate: boolean }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [fetchingDiff, setFetchingDiff] = useState(false);

  const handleParse = async () => {
    const items = parsePaste(rawText);
    setFetchingDiff(true);

    const withDifficulty = await Promise.all(
      items.map(async (item) => {
        let difficulty = "Unknown";
        try {
          const res = await fetch(`/api/leetcode?slug=${item.slug}`);
          const data = await res.json();
          difficulty = data.difficulty || "Unknown";
        } catch {
          difficulty = "Unknown";
        }

        return {
          ...item,
          difficulty,
          tags: "[]",
          isDuplicate: existingUrls.includes(item.url),
        };
      })
    );

    setParsed(withDifficulty);
    setFetchingDiff(false);
  };

  const handleAdd = () => {
    const newProblems = parsed.filter((p) => !p.isDuplicate);
    if (newProblems.length === 0) {
      toast.error("No new problems to add");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/problems/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patternId,
          problems: newProblems.map((p) => ({
            srNo: p.srNo,
            title: p.title,
            url: p.url,
            difficulty: p.difficulty,
            tags: p.tags,
          })),
        }),
      });
      const data = await res.json();
      toast.success(`${data.count} problems added to ${patternName}`);
      setRawText("");
      setParsed([]);
      setExpanded(false);
    });
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 rounded-md border border-[#1f1f1f] bg-transparent px-3 py-1.5 text-sm text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
      >
        {expanded ? (
          <ChevronUp size={14} strokeWidth={1.5} />
        ) : (
          <Plus size={14} strokeWidth={1.5} />
        )}
        Add Problems
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
              <p className="mb-2 text-xs text-[#6b7280]">
                Paste problems — one per line
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={'1. Two Sum — https://leetcode.com/problems/two-sum/'}
                className="h-32 w-full resize-none rounded-md border border-[#1f1f1f] bg-[#111] p-3 font-mono text-sm text-[#ededed] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
              <button
                onClick={handleParse}
                disabled={!rawText.trim() || fetchingDiff}
                className="mt-2 rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#e5e5e5] disabled:opacity-50"
              >
                {fetchingDiff ? "Fetching..." : "Parse & Preview"}
              </button>

              {parsed.length > 0 && (
                <div className="mt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1f1f1f]">
                        <th className="px-2 py-1.5 text-left text-xs uppercase text-[#6b7280]">#</th>
                        <th className="px-2 py-1.5 text-left text-xs uppercase text-[#6b7280]">Title</th>
                        <th className="px-2 py-1.5 text-left text-xs uppercase text-[#6b7280]">URL</th>
                        <th className="px-2 py-1.5 text-left text-xs uppercase text-[#6b7280]">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.map((p, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[#1f1f1f] ${p.isDuplicate ? "border-l-2 border-l-[#ef4444]" : ""}`}
                        >
                          <td className="px-2 py-1.5 text-xs text-[#6b7280]">{p.srNo}</td>
                          <td className="px-2 py-1.5 text-sm">
                            {p.title}
                            {p.isDuplicate && (
                              <span className="ml-2 text-xs text-[#ef4444]">Exists</span>
                            )}
                          </td>
                          <td className="max-w-[200px] truncate px-2 py-1.5 text-xs text-[#6b7280]">
                            {p.url}
                          </td>
                          <td className="px-2 py-1.5 text-xs">
                            <span
                              className={
                                p.difficulty === "Easy"
                                  ? "text-[#22c55e]"
                                  : p.difficulty === "Medium"
                                  ? "text-[#eab308]"
                                  : p.difficulty === "Hard"
                                  ? "text-[#ef4444]"
                                  : "text-[#6b7280]"
                              }
                            >
                              {p.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={handleAdd}
                    disabled={isPending || parsed.filter((p) => !p.isDuplicate).length === 0}
                    className="mt-3 rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#e5e5e5] disabled:opacity-50"
                  >
                    Add {parsed.filter((p) => !p.isDuplicate).length} Problems
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

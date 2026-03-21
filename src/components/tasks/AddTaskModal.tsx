"use client";

import { useState } from "react";
import { type Task } from "@prisma/client";
import { X, Calendar } from "lucide-react";

interface AddTaskModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTaskModal({ userId, onClose, onSuccess }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
      }),
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#333] bg-[#0d0d0d] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222] px-6 py-4">
          <h2 className="text-lg font-medium text-[#ededed]">New Task</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#6b7280] transition-colors hover:bg-[#222] hover:text-[#ededed]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] placeholder:text-[#4b5563] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#333] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] placeholder:text-[#4b5563] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-[#333] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-[#333] bg-[#111] pl-9 pr-3.5 py-2.5 text-sm text-[#ededed] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-all [color-scheme:dark]"
                />
                <Calendar size={14} className="absolute left-3 top-3 text-[#6b7280]" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#8b92a0] transition-colors hover:bg-[#222] hover:text-[#ededed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

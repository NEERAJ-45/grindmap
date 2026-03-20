"use client";

import { useState } from "react";
import { type Task } from "@prisma/client";
import { updateTaskStatus, deleteTask } from "@/app/actions/task-actions";
import { Check, Clock, AlertCircle, Trash2, Calendar, ChevronDown, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskRowProps {
  task: Task;
  userId: string;
  onUpdate: () => void;
}

export function TaskRow({ task, userId, onUpdate }: TaskRowProps) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isDone = task.status === "done";

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = isDone ? "todo" : "done";
    await updateTaskStatus(userId, task.id, newStatus);
    setLoading(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    await deleteTask(task.id);
    onUpdate();
  };

  const getPriorityIconAndColor = (priority: string) => {
    switch (priority) {
      case "high": return { icon: AlertCircle, color: "text-[#ef4444]" };
      case "medium": return { icon: Clock, color: "text-[#eab308]" };
      case "low": return { icon: ListTodo, color: "text-[#3b82f6]" };
      default: return { icon: ListTodo, color: "text-[#6b7280]" };
    }
  };

  const { icon: PriorityIcon, color: priorityColor } = getPriorityIconAndColor(task.priority);

  return (
    <div className={cn(
      "group rounded-xl border border-[#1f1f1f] bg-[#111] transition-all hover:border-[#333] hover:bg-[#151515]",
      isDone && "opacity-60 bg-[#0d0d0d]",
      loading && "opacity-50 pointer-events-none"
    )}>
      <div className="flex items-center p-4 gap-4">
        {/* Checkbox */}
        <button
          onClick={toggleStatus}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
            isDone
              ? "border-[#3b82f6] bg-[#3b82f6] text-white"
              : "border-[#4b5563] bg-transparent hover:border-[#3b82f6]"
          )}
        >
          {isDone && <Check size={12} strokeWidth={3} />}
        </button>

        {/* Info */}
        <div 
          className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
          onClick={() => task.description && setExpanded(!expanded)}
        >
          <div className="flex flex-col gap-1">
            <span className={cn(
              "text-sm font-medium transition-colors",
              isDone ? "text-[#6b7280] line-through decoration-[#4b5563]" : "text-[#ededed]"
            )}>
              {task.title}
            </span>
            {task.description && (
              <span className="text-xs text-[#6b7280] flex items-center gap-1">
                <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
                {expanded ? "Hide description" : "View description"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1.5 rounded bg-[#1a1a1a] px-2 py-1 text-xs text-[#8b92a0] border border-[#222]">
                <Calendar size={12} />
                {format(new Date(task.dueDate), "MMM d")}
              </div>
            )}
            
            {/* Priority */}
            <div className="flex justify-center w-6">
              <PriorityIcon size={14} className={isDone ? "text-[#4b5563]" : priorityColor} />
            </div>
            
            {/* Status Batch */}
            <div className="hidden sm:flex items-center justify-center w-20">
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                isDone ? "bg-[#111] text-[#4b5563]" : "bg-[#3b82f6]/10 text-[#3b82f6]"
              )}>
                {task.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleDelete}
          className="p-1.5 text-[#4b5563] opacity-0 transition-all hover:text-[#ef4444] group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {expanded && task.description && (
        <div className="px-12 pb-4 text-sm text-[#8b92a0]">
          <p className="border-l-2 border-[#1f1f1f] pl-3">
            {task.description}
          </p>
        </div>
      )}
    </div>
  );
}

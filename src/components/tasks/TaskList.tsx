"use client";

import { type Task } from "@prisma/client";
import { TaskRow } from "./TaskRow";

interface TaskListProps {
  tasks: Task[];
  userId: string;
  onTaskUpdated: () => void;
}

export function TaskList({ tasks, userId, onTaskUpdated }: TaskListProps) {
  // Sort: pending first, then by priority, then date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (a.status !== "done" && b.status === "done") return -1;
    
    const prioLevels: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const aPrio = prioLevels[a.priority] || 0;
    const bPrio = prioLevels[b.priority] || 0;
    
    if (aPrio !== bPrio) return bPrio - aPrio;
    
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-2">
      {sortedTasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          userId={userId}
          onUpdate={onTaskUpdated}
        />
      ))}
    </div>
  );
}

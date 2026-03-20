"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { useEffect, useState } from "react";
import { getTasks } from "@/app/actions/task-actions";
import { type Task } from "@prisma/client";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { CheckSquare, Plus } from "lucide-react";


export function TasksClient() {
  const userId = useFingerprint();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async (uid: string) => {
    try {
      const data = await getTasks(uid);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks(userId);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                  <CheckSquare size={20} className="text-[#3b82f6]" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Active Tasks
                </h1>
              </div>
              <p className="max-w-xl text-sm text-[#8b92a0]">
                Manage your daily operations, action items, and strategic directives.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2563eb]"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>

      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {!userId || loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-[#111] border border-[#1f1f1f]" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            userId={userId}
            onTaskUpdated={() => fetchTasks(userId)}
          />
        ) : (
          <div className="rounded-xl border border-[#1f1f1f] border-dashed p-12 text-center">
            <CheckSquare size={32} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#8b92a0]">No active tasks. You're all caught up.</p>
          </div>
        )}
      </main>

      {isModalOpen && userId && (
        <AddTaskModal
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchTasks(userId);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

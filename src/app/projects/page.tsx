"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { useEffect, useState } from "react";
import { type Project, type ProjectTask } from "@prisma/client";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { FolderKanban, Plus, X } from "lucide-react";


type ProjectWithTasks = Project & { tasks: ProjectTask[] };

export default function ProjectsPage() {
  const userId = useFingerprint();
  const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProjects = async (uid: string) => {
    try {
      const res = await fetch(`/api/projects?userId=${uid}`);
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProjects(userId);
    }
  }, [userId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !userId) return;

    setCreating(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title: newTitle, description: newDesc }),
    });
    await fetchProjects(userId);
    setCreating(false);
    setIsModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                  <FolderKanban size={20} className="text-[#3b82f6]" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Projects
                </h1>
              </div>
              <p className="max-w-xl text-sm text-[#8b92a0]">
                Build, execute, and ship. Track milestones and active development phases.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2563eb]"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

      </section>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {!userId || loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 w-full animate-pulse rounded-xl bg-[#111] border border-[#1f1f1f]" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1f1f1f] border-dashed p-12 text-center">
            <FolderKanban size={32} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#8b92a0]">No active projects. Start building.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#333] bg-[#0d0d0d] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222] px-6 py-4">
              <h2 className="text-lg font-medium text-[#ededed]">New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-[#6b7280] transition-colors hover:bg-[#222] hover:text-[#ededed]"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Cache Engine"
                  className="w-full rounded-lg border border-[#333] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] focus:border-[#3b82f6] outline-none"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b92a0]">
                  Description (Optional)
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What are you building?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#333] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] focus:border-[#3b82f6] outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[#8b92a0] hover:text-[#ededed]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="rounded-lg bg-[#3b82f6] px-5 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

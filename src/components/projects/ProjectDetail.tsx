"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { useState } from "react";
import { type Project, type ProjectTask } from "@prisma/client";
import { 
  updateProject, 
  deleteProject, 
  addProjectTask, 
  toggleProjectTask, 
  deleteProjectTask 
} from "@/app/actions/project-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  FolderKanban, 
  Plus, 
  Trash2, 
  Check, 
  CircleDashed,
  CheckCircle2,
  Clock,
  Settings2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type ProjectWithTasks = Project & { tasks: ProjectTask[] };

export function ProjectDetail({ initialProject }: { initialProject: ProjectWithTasks }) {
  const userId = useFingerprint();
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithTasks>(initialProject);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleStatusChange = async (status: string) => {
    if (!userId) return;
    setLoading(true);
    await updateProject(userId, project.id, { status });
    setProject({ ...project, status });
    setLoading(false);
  };

  const handleTaskAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    await addProjectTask(project.id, newTaskTitle);
    
    // Optimistic update
    const newTask = {
      id: Math.random().toString(),
      projectId: project.id,
      title: newTaskTitle,
      done: false,
      createdAt: new Date(),
    } as ProjectTask;
    
    setProject({
      ...project,
      tasks: [...project.tasks, newTask],
    });
    setNewTaskTitle("");
    setLoading(false);
    router.refresh(); // Fetch real data in background
  };

  const handleTaskToggle = async (taskId: string, done: boolean) => {
    if (!userId) return;
    setLoading(true);
    await toggleProjectTask(userId, project.id, taskId, done);
    
    // Optimistic
    setProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)),
    });
    setLoading(false);
    router.refresh();
  };

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    await deleteProjectTask(project.id, taskId);
    setProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
    });
    setLoading(false);
    router.refresh();
  };

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this entire project? This cannot be undone.")) return;
    setLoading(true);
    await deleteProject(project.id);
    router.push("/projects");
  };

  const doneCount = project.tasks.filter(t => t.done).length;
  const progress = project.tasks.length === 0 ? 0 : Math.round((doneCount / project.tasks.length) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "building": return <CircleDashed size={14} className="animate-[spin_4s_linear_infinite]" />;
      case "completed": return <CheckCircle2 size={14} />;
      case "paused": return <Clock size={14} />;
      default: return <FolderKanban size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1 text-sm text-[#6b7280] transition-colors hover:text-[#ededed]"
        >
          <ChevronLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-10 rounded-2xl border border-[#1f1f1f] bg-[#111] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-[#6b7280] hover:text-[#ededed] transition-colors bg-[#1a1a1a] border border-[#222] rounded-lg"
            >
              <Settings2 size={18} />
            </button>
            
            {showSettings && (
              <div className="absolute right-8 top-20 w-48 rounded-xl border border-[#333] bg-[#0d0d0d] shadow-2xl p-2 z-10 flex flex-col gap-1">
                {["planning", "building", "paused", "completed"].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => { handleStatusChange(stat); setShowSettings(false); }}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors capitalize",
                      project.status === stat ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "text-[#8b92a0] hover:bg-[#1a1a1a] hover:text-[#ededed]"
                    )}
                  >
                    {getStatusIcon(stat)}
                    {stat}
                  </button>
                ))}
                <div className="h-px bg-[#222] my-1" />
                <button
                  onClick={handleDeleteProject}
                  className="w-full text-left px-3 py-2 text-sm text-[#ef4444] rounded-lg hover:bg-[#ef4444]/10 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#222]">
              {getStatusIcon(project.status)}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#ededed]">{project.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-[#8b92a0]">
                <span className="capitalize">{project.status}</span>
                <span className="w-1 h-1 rounded-full bg-[#333]" />
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {project.description && (
            <p className="max-w-3xl mt-6 text-[#8b92a0] leading-relaxed">
              {project.description}
            </p>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-2 text-sm font-medium">
              <span className="text-[#8b92a0]">Overall Progress</span>
              <span className="text-[#ededed]">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                className="h-full rounded-full bg-[#3b82f6] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div>
          <h2 className="text-lg font-medium text-[#ededed] mb-4 flex items-center gap-2">
            Tasks <span className="text-[#6b7280] text-sm">({doneCount}/{project.tasks.length})</span>
          </h2>

          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] overflow-hidden">
            <div className="divide-y divide-[#1f1f1f]">
              {project.tasks.map((task) => (
                <div key={task.id} className="flex items-center p-4 gap-4 transition-colors hover:bg-[#151515] group">
                  <button
                    onClick={() => handleTaskToggle(task.id, !task.done)}
                    disabled={loading}
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                      task.done
                        ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                        : "border-[#4b5563] bg-transparent hover:border-[#3b82f6]"
                    )}
                  >
                    {task.done && <Check size={12} strokeWidth={3} />}
                  </button>
                  <span className={cn(
                    "flex-1 text-sm transition-colors",
                    task.done ? "text-[#6b7280] line-through decoration-[#4b5563]" : "text-[#ededed]"
                  )}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#4b5563] hover:text-[#ef4444] transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleTaskAdd} className="p-4 bg-[#0d0d0d] border-t border-[#1f1f1f]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 rounded-lg border border-[#333] bg-[#111] px-3.5 py-2 text-sm text-[#ededed] focus:border-[#3b82f6] outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !newTaskTitle.trim()}
                  className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2563eb] disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { type Project, type ProjectTask } from "@prisma/client";
import { FolderKanban, Clock, CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project & { tasks: ProjectTask[] };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tasksCount = project.tasks.length;
  const doneCount = project.tasks.filter(t => t.done).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "building": return <CircleDashed size={14} className="text-[#3b82f6] animate-[spin_4s_linear_infinite]" />;
      case "completed": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "paused": return <Clock size={14} className="text-[#eab308]" />;
      default: return <FolderKanban size={14} className="text-[#6b7280]" />; // planning
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "building": return "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]";
      case "completed": return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
      case "paused": return "border-[#eab308]/30 bg-[#eab308]/10 text-[#eab308]";
      default: return "border-[#333] bg-[#1a1a1a] text-[#8b92a0]";
    }
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all hover:border-[#333] hover:bg-[#151515]"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider",
            getStatusColor(project.status)
          )}>
            {getStatusIcon(project.status)}
            {project.status.replace("_", " ")}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-[#ededed] line-clamp-1">{project.title}</h3>
        {project.description && (
          <p className="mt-1.5 text-sm text-[#6b7280] line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2 text-xs font-medium text-[#8b92a0]">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f1f1f]">
          <div
            className="h-full rounded-full bg-[#3b82f6] transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-[#6b7280]">
          <span>{doneCount} / {tasksCount} tasks</span>
          <span className="group-hover:text-[#3b82f6] transition-colors">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
}

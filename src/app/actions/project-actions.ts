"use server";

import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function createProject(
  userId: string,
  data: {
    title: string;
    description?: string;
  }
) {
  const project = await prisma.project.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
    },
  });
  revalidatePath("/projects");
  return project;
}

export async function updateProject(
  userId: string,
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    progress?: number;
  }
) {
  await prisma.project.update({
    where: { id },
    data,
  });

  if (data.status || data.progress !== undefined) {
    await logActivity({
      userId,
      action: "project_update",
      domain: "project",
      meta: { projectId: id, ...data },
    });
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/stats");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
}

// ── Project Tasks ─────────────────────────────
export async function addProjectTask(projectId: string, title: string) {
  await prisma.projectTask.create({
    data: { projectId, title },
  });

  // Recalculate progress
  await recalculateProgress(projectId);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
}

export async function toggleProjectTask(
  userId: string,
  projectId: string,
  taskId: string,
  done: boolean
) {
  await prisma.projectTask.update({
    where: { id: taskId },
    data: { done },
  });

  await recalculateProgress(projectId);

  if (done) {
    await logActivity({
      userId,
      action: "project_update",
      domain: "project",
      meta: { projectId, taskId, action: "task_complete" },
    });
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/stats");
}

export async function deleteProjectTask(projectId: string, taskId: string) {
  await prisma.projectTask.delete({ where: { id: taskId } });
  await recalculateProgress(projectId);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
}

async function recalculateProgress(projectId: string) {
  const tasks = await prisma.projectTask.findMany({
    where: { projectId },
  });
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });
}

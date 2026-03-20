"use server";

import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function getTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }
) {
  const task = await prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
      priority: data.priority || "medium",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
  revalidatePath("/tasks");
  return task;
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string | null;
  }
) {
  await prisma.task.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
  revalidatePath("/tasks");
}

export async function updateTaskStatus(
  userId: string,
  id: string,
  status: string
) {
  const completedAt = status === "done" ? new Date() : null;
  await prisma.task.update({
    where: { id },
    data: { status, completedAt },
  });

  if (status === "done") {
    await logActivity({
      userId,
      action: "task_complete",
      domain: "task",
      meta: { taskId: id },
    });
  }

  revalidatePath("/tasks");
  revalidatePath("/stats");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/tasks");
}

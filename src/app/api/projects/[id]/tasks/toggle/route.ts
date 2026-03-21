import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

// POST /api/projects/:id/tasks/toggle — toggle subtask done
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { userId, taskId, done } = await request.json();
    if (!taskId || typeof done !== "boolean") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.projectTask.update({
      where: { id: taskId },
      data: { done },
    });

    // Recalculate progress
    const tasks = await prisma.projectTask.findMany({ where: { projectId } });
    const total = tasks.length;
    const doneCount = tasks.filter((t) => t.done).length;
    const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    await prisma.project.update({ where: { id: projectId }, data: { progress } });

    if (done && userId) {
      await logActivity({
        userId,
        action: "project_update",
        domain: "project",
        meta: { projectId, taskId, action: "task_complete" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

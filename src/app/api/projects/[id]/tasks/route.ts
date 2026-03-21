import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

// POST /api/projects/:id/tasks — add subtask
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    await prisma.projectTask.create({ data: { projectId, title } });
    await recalculateProgress(projectId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/projects/:id/tasks — delete subtask (body: { taskId })
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { taskId } = await request.json();
    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await prisma.projectTask.delete({ where: { id: taskId } });
    await recalculateProgress(projectId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function recalculateProgress(projectId: string) {
  const tasks = await prisma.projectTask.findMany({ where: { projectId } });
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  await prisma.project.update({ where: { id: projectId }, data: { progress } });
}

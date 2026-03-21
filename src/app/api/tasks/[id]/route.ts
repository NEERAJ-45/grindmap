import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

// PATCH /api/tasks/:id — update task fields
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Handle status update with activity logging
    if (body.status) {
      const completedAt = body.status === "done" ? new Date() : null;
      await prisma.task.update({
        where: { id },
        data: { ...body, completedAt, dueDate: body.dueDate === null ? null : body.dueDate ? new Date(body.dueDate) : undefined },
      });

      if (body.status === "done" && body.userId) {
        await logActivity({
          userId: body.userId,
          action: "task_complete",
          domain: "task",
          meta: { taskId: id },
        });
      }
    } else {
      await prisma.task.update({
        where: { id },
        data: {
          ...body,
          dueDate: body.dueDate === null ? null : body.dueDate ? new Date(body.dueDate) : undefined,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/tasks/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

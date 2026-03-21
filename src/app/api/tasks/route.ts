import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

// GET /api/tasks?userId=X
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/tasks — create task
export async function POST(request: Request) {
  try {
    const { userId, title, description, priority, dueDate } = await request.json();
    if (!userId || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

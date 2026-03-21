import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

// GET /api/projects?userId=X
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/projects — create project
export async function POST(request: Request) {
  try {
    const { userId, title, description } = await request.json();
    if (!userId || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description: description || null,
      },
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

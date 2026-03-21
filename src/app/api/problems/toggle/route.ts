import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

export async function POST(request: Request) {
  try {
    const { userId, problemId, done } = await request.json();
    if (!userId || !problemId || typeof done !== "boolean") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Upsert user
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: { lastActive: new Date() },
    });

    const existing = await prisma.userProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    if (existing) {
      await prisma.userProblem.update({
        where: { id: existing.id },
        data: { done, solvedOn: done ? new Date() : null },
      });
    } else {
      await prisma.userProblem.create({
        data: { userId, problemId, done, solvedOn: done ? new Date() : null },
      });
    }

    if (done) {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { patternId: true },
      });
      await logActivity({
        userId,
        action: "solve",
        problemId,
        patternId: problem?.patternId ?? undefined,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

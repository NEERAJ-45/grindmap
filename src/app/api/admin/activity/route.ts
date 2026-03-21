import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("Operation Breakout_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const enriched = await Promise.all(
    logs.map(async (log) => {
      let problemTitle: string | null = null;
      let patternName: string | null = null;

      if (log.problemId) {
        const p = await prisma.problem.findUnique({
          where: { id: log.problemId },
          select: { title: true },
        });
        problemTitle = p?.title ?? null;
      }
      if (log.patternId) {
        const p = await prisma.pattern.findUnique({
          where: { id: log.patternId },
          select: { name: true },
        });
        patternName = p?.name ?? null;
      }

      return { ...log, createdAt: log.createdAt.toISOString(), problemTitle, patternName };
    })
  );

  return NextResponse.json(enriched);
}

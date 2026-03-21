import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { patternId, problems } = await request.json();
    if (!patternId || !Array.isArray(problems)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.problem.findMany({
      where: { patternId },
      select: { url: true },
    });
    const existingUrls = new Set(existing.map((p) => p.url));
    const newProblems = problems.filter(
      (p: { url: string }) => !existingUrls.has(p.url)
    );

    if (newProblems.length > 0) {
      await Promise.all(
        newProblems.map((p: { srNo: number; title: string; url: string; difficulty: string; tags: string }) =>
          prisma.problem.create({ data: { ...p, patternId } })
        )
      );
    }

    return NextResponse.json({ count: newProblems.length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

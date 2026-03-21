import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ patterns: [], problems: [] });
    }

    const patterns = await prisma.pattern.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 5,
    });

    const problems = await prisma.problem.findMany({
      where: { title: { contains: query, mode: "insensitive" } },
      include: { pattern: { select: { name: true, slug: true } } },
      take: 10,
    });

    return NextResponse.json({ patterns, problems });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

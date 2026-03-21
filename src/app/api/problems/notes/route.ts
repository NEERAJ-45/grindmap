import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, problemId, notes } = await request.json();
    if (!userId || !problemId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.userProblem.upsert({
      where: { userId_problemId: { userId, problemId } },
      create: { userId, problemId, notes },
      update: { notes },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

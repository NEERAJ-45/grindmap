import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("Operation Breakout_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalUsers = await prisma.user.count();
  const solvedToday = await prisma.userProblem.count({
    where: { done: true, solvedOn: { gte: todayStart } },
  });
  const activeToday = await prisma.user.count({
    where: { lastActive: { gte: todayStart } },
  });
  const totalPatterns = await prisma.pattern.count();
  const totalProblems = await prisma.problem.count();

  return NextResponse.json({ totalUsers, solvedToday, activeToday, totalPatterns, totalProblems });
}

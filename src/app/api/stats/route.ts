import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const now = new Date();

    // ── DSA Stats ──
    const totalProblems = await prisma.problem.count();
    const userProblems = await prisma.userProblem.findMany({
      where: { userId, done: true },
      include: { problem: true },
    });

    const solved = userProblems.length;
    const pending = totalProblems - solved;

    const solvedDates = userProblems
      .filter((up) => up.solvedOn)
      .map((up) => up.solvedOn!);

    // Daily solve counts for heatmap
    const solveCounts: Record<string, number> = {};
    for (const up of userProblems) {
      if (up.solvedOn) {
        const dateKey = up.solvedOn.toISOString().split("T")[0];
        solveCounts[dateKey] = (solveCounts[dateKey] || 0) + 1;
      }
    }

    // Difficulty distribution
    const easy = userProblems.filter((up) => up.problem.difficulty === "Easy").length;
    const medium = userProblems.filter((up) => up.problem.difficulty === "Medium").length;
    const hard = userProblems.filter((up) => up.problem.difficulty === "Hard").length;

    // Pattern progress
    const patterns = await prisma.pattern.findMany({
      include: {
        problems: {
          include: { users: { where: { userId, done: true } } },
        },
      },
    });

    const patternProgress = patterns.map((p) => ({
      name: p.name,
      slug: p.slug,
      total: p.problems.length,
      solved: p.problems.filter((pr) => pr.users.length > 0).length,
    }));

    // Weekly and today counts
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const thisWeek = userProblems.filter(
      (up) => up.solvedOn && up.solvedOn >= weekAgo
    ).length;
    const today = userProblems.filter(
      (up) => up.solvedOn && up.solvedOn >= todayStart
    ).length;

    // Daily solves last 30 days
    const dailySolves: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailySolves.push({ date: key, count: solveCounts[key] || 0 });
    }

    // ── New domain stats ──
    const sdCompleted = await prisma.userSDItem.count({
      where: { userId, done: true },
    });
    const tasksCompleted = await prisma.task.count({
      where: { userId, status: "done" },
    });
    const projectsCompleted = await prisma.project.count({
      where: { userId, status: "completed" },
    });

    // Combined daily activity (all domains) — last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = await prisma.activityLog.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, domain: true },
    });

    const domainDaily: Record<string, Record<string, number>> = {};
    for (const log of recentActivity) {
      const dateKey = log.createdAt.toISOString().split("T")[0];
      if (!domainDaily[dateKey]) domainDaily[dateKey] = {};
      domainDaily[dateKey][log.domain] = (domainDaily[dateKey][log.domain] || 0) + 1;
    }

    const combinedDaily: { date: string; dsa: number; system_design: number; task: number; project: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const dayData = domainDaily[key] || {};
      combinedDaily.push({
        date: key,
        dsa: dayData["dsa"] || 0,
        system_design: dayData["system_design"] || 0,
        task: dayData["task"] || 0,
        project: dayData["project"] || 0,
      });
    }

    // Domain distribution
    const domainDist = [
      { name: "DSA", value: solved },
      { name: "System Design", value: sdCompleted },
      { name: "Tasks", value: tasksCompleted },
      { name: "Projects", value: projectsCompleted },
    ];

    return NextResponse.json({
      totalProblems,
      solved,
      pending,
      solvedDates: solvedDates.map((d) => d.toISOString()),
      solveCounts,
      easy,
      medium,
      hard,
      patternProgress,
      thisWeek,
      today,
      dailySolves,
      sdCompleted,
      tasksCompleted,
      projectsCompleted,
      combinedDaily,
      domainDist,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

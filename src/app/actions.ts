"use server";

import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

// ── User ──────────────────────────────────────
export async function upsertUser(userId: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    await prisma.user.create({ data: { id: userId } });
    await logActivity({ userId, action: "new_user" });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });
  }
}

// ── Patterns ──────────────────────────────────
export async function getPatterns() {
  return prisma.pattern.findMany({
    include: {
      problems: {
        include: { users: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getPatternBySlug(slug: string) {
  return prisma.pattern.findUnique({
    where: { slug },
    include: {
      problems: {
        include: { users: true },
        orderBy: { srNo: "asc" },
      },
    },
  });
}

export async function createPattern(data: {
  name: string;
  slug: string;
  icon: string;
}) {
  const pattern = await prisma.pattern.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/patterns");
  return pattern;
}

export async function updatePattern(
  id: number,
  data: { name?: string; slug?: string; icon?: string }
) {
  const pattern = await prisma.pattern.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/patterns");
  return pattern;
}

export async function deletePattern(id: number) {
  await prisma.pattern.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/patterns");
}

// ── Problems ──────────────────────────────────
export async function addProblems(
  patternId: number,
  problems: {
    srNo: number;
    title: string;
    url: string;
    difficulty: string;
    tags: string;
  }[]
) {
  const existing = await prisma.problem.findMany({
    where: { patternId },
    select: { url: true },
  });
  const existingUrls = new Set(existing.map((p) => p.url));
  const newProblems = problems.filter((p) => !existingUrls.has(p.url));

  if (newProblems.length > 0) {
    await prisma.problem.createMany({
      data: newProblems.map((p) => ({ ...p, patternId })),
    });
  }

  revalidatePath("/");
  revalidatePath(`/patterns`);
  return newProblems.length;
}

export async function deleteProblem(id: number) {
  await prisma.problem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/patterns");
}

export async function deleteProblems(ids: number[]) {
  await prisma.problem.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/");
  revalidatePath("/patterns");
}

export async function updateProblem(
  id: number,
  data: { title?: string; difficulty?: string; tags?: string; url?: string }
) {
  await prisma.problem.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/patterns");
}

// ── UserProblem (toggle solve, notes) ─────────
export async function toggleProblemDone(
  userId: string,
  problemId: number,
  done: boolean
) {
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
      data: {
        done,
        solvedOn: done ? new Date() : null,
      },
    });
  } else {
    await prisma.userProblem.create({
      data: {
        userId,
        problemId,
        done,
        solvedOn: done ? new Date() : null,
      },
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

  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath("/stats");
}

export async function updateSolvedDate(
  userId: string,
  problemId: number,
  date: string | null
) {
  await prisma.userProblem.upsert({
    where: { userId_problemId: { userId, problemId } },
    create: {
      userId,
      problemId,
      done: !!date,
      solvedOn: date ? new Date(date) : null,
    },
    update: {
      solvedOn: date ? new Date(date) : null,
      done: !!date,
    },
  });
  revalidatePath("/patterns");
  revalidatePath("/stats");
}

export async function updateNotes(
  userId: string,
  problemId: number,
  notes: string
) {
  await prisma.userProblem.upsert({
    where: { userId_problemId: { userId, problemId } },
    create: { userId, problemId, notes },
    update: { notes },
  });
}

// ── Search ────────────────────────────────────
export async function searchProblems(query: string) {
  if (!query || query.length < 2) return { patterns: [], problems: [] };

  const patterns = await prisma.pattern.findMany({
    where: { name: { contains: query } },
    take: 5,
  });

  const problems = await prisma.problem.findMany({
    where: { title: { contains: query } },
    include: { pattern: { select: { name: true, slug: true } } },
    take: 10,
  });

  return { patterns, problems };
}

// ── Stats ─────────────────────────────────────
export async function getUserStats(userId: string) {
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
  const easy = userProblems.filter(
    (up) => up.problem.difficulty === "Easy"
  ).length;
  const medium = userProblems.filter(
    (up) => up.problem.difficulty === "Medium"
  ).length;
  const hard = userProblems.filter(
    (up) => up.problem.difficulty === "Hard"
  ).length;

  // Pattern progress
  const patterns = await prisma.pattern.findMany({
    include: {
      problems: {
        include: {
          users: { where: { userId, done: true } },
        },
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
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const thisWeek = userProblems.filter(
    (up) => up.solvedOn && up.solvedOn >= weekAgo
  ).length;
  const today = userProblems.filter(
    (up) => up.solvedOn && up.solvedOn >= todayStart
  ).length;

  // Daily solves last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailySolves: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailySolves.push({ date: key, count: solveCounts[key] || 0 });
  }

  return {
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
  };
}

// ── Broadcast ─────────────────────────────────
export async function getActiveBroadcast() {
  return prisma.broadcast.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}

// ── Admin Stats ───────────────────────────────
export async function getAdminStats() {
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

  return { totalUsers, solvedToday, activeToday, totalPatterns, totalProblems };
}

export async function getAdminActivity(limit = 50) {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Enrich with names
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

      return {
        ...log,
        createdAt: log.createdAt.toISOString(),
        problemTitle,
        patternName,
      };
    })
  );

  return enriched;
}

export async function getAdminAnalytics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // DAU last 14 days
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const recentUsers = await prisma.user.findMany({
    where: { lastActive: { gte: fourteenDaysAgo } },
    select: { lastActive: true },
  });

  const dauMap: Record<string, Set<string>> = {};
  // Use activity logs for more accurate DAU
  const recentLogs = await prisma.activityLog.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { userId: true, createdAt: true },
  });

  for (const log of recentLogs) {
    const key = log.createdAt.toISOString().split("T")[0];
    if (!dauMap[key]) dauMap[key] = new Set();
    dauMap[key].add(log.userId);
  }

  const dau = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dau.push({ date: key, users: dauMap[key]?.size || 0 });
  }

  // Top 5 patterns by total solves
  const patterns = await prisma.pattern.findMany({
    include: {
      problems: {
        include: { users: { where: { done: true } } },
      },
    },
  });

  const patternSolves = patterns
    .map((p) => ({
      name: p.name,
      solves: p.problems.reduce((acc, pr) => acc + pr.users.length, 0),
    }))
    .sort((a, b) => b.solves - a.solves)
    .slice(0, 5);

  // Top 10 most/least solved
  const allProblems = await prisma.problem.findMany({
    include: {
      users: { where: { done: true } },
      pattern: { select: { name: true } },
    },
  });

  const problemSolves = allProblems
    .map((p) => ({
      title: p.title,
      pattern: p.pattern.name,
      solves: p.users.length,
      difficulty: p.difficulty,
    }))
    .sort((a, b) => b.solves - a.solves);

  const mostSolved = problemSolves.slice(0, 10);
  const leastSolved = [...problemSolves]
    .sort((a, b) => a.solves - b.solves)
    .slice(0, 10);

  // Difficulty distribution of all solves
  const allSolves = await prisma.userProblem.findMany({
    where: { done: true },
    include: { problem: { select: { difficulty: true } } },
  });

  const diffDist = { Easy: 0, Medium: 0, Hard: 0 };
  for (const s of allSolves) {
    const d = s.problem.difficulty as keyof typeof diffDist;
    if (d in diffDist) diffDist[d]++;
  }

  // Solve rate per pattern
  const patternSolveRates = patterns.map((p) => {
    const totalUsers = new Set(
      p.problems.flatMap((pr) => pr.users.map((u) => u.userId))
    ).size;
    const totalPossible = p.problems.length * Math.max(totalUsers, 1);
    const totalSolved = p.problems.reduce(
      (acc, pr) => acc + pr.users.length,
      0
    );
    return {
      name: p.name,
      rate: totalPossible > 0 ? Math.round((totalSolved / totalPossible) * 100) : 0,
    };
  });

  // User solve count distribution
  const userSolveCounts = await prisma.userProblem.groupBy({
    by: ["userId"],
    where: { done: true },
    _count: { id: true },
  });

  const buckets = { "0": 0, "1-5": 0, "6-10": 0, "11-20": 0, "21-50": 0, "50+": 0 };
  const totalUserCount = await prisma.user.count();
  const usersWithSolves = new Set(userSolveCounts.map((u) => u.userId));

  buckets["0"] = totalUserCount - usersWithSolves.size;
  for (const u of userSolveCounts) {
    const c = u._count.id;
    if (c <= 5) buckets["1-5"]++;
    else if (c <= 10) buckets["6-10"]++;
    else if (c <= 20) buckets["11-20"]++;
    else if (c <= 50) buckets["21-50"]++;
    else buckets["50+"]++;
  }

  // Funnel
  const solved1Plus = userSolveCounts.filter((u) => u._count.id >= 1).length;
  const solved5Plus = userSolveCounts.filter((u) => u._count.id >= 5).length;
  const solved10Plus = userSolveCounts.filter((u) => u._count.id >= 10).length;

  // Completed a pattern
  const completedPattern = patterns.filter((p) => {
    const totalProbs = p.problems.length;
    if (totalProbs === 0) return false;
    // Check if any user solved all problems in this pattern
    const userSolveSets: Record<string, number> = {};
    for (const prob of p.problems) {
      for (const up of prob.users) {
        userSolveSets[up.userId] = (userSolveSets[up.userId] || 0) + 1;
      }
    }
    return Object.values(userSolveSets).some((c) => c >= totalProbs);
  }).length > 0 ? 1 : 0; // Simplified

  // Daily solves last 30 days
  const recentSolves = await prisma.userProblem.findMany({
    where: { done: true, solvedOn: { gte: thirtyDaysAgo } },
    select: { solvedOn: true },
  });

  const dailySolves: Record<string, number> = {};
  for (const s of recentSolves) {
    if (s.solvedOn) {
      const key = s.solvedOn.toISOString().split("T")[0];
      dailySolves[key] = (dailySolves[key] || 0) + 1;
    }
  }

  const dailySolvesArr = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailySolvesArr.push({ date: key, count: dailySolves[key] || 0 });
  }

  // Platform heatmap (all users, last year)
  const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const yearSolves = await prisma.userProblem.findMany({
    where: { done: true, solvedOn: { gte: yearAgo } },
    select: { solvedOn: true },
  });

  const platformHeatmap: Record<string, number> = {};
  for (const s of yearSolves) {
    if (s.solvedOn) {
      const key = s.solvedOn.toISOString().split("T")[0];
      platformHeatmap[key] = (platformHeatmap[key] || 0) + 1;
    }
  }

  return {
    dau,
    patternSolves,
    mostSolved,
    leastSolved,
    diffDist,
    patternSolveRates,
    buckets,
    funnel: {
      totalUsers: totalUserCount,
      solved1Plus,
      solved5Plus,
      solved10Plus,
      completedPattern,
    },
    dailySolves: dailySolvesArr,
    platformHeatmap,
  };
}

// ── Admin Users ───────────────────────────────
export async function getAdminUsers(filters?: {
  active?: string;
  minStreak?: number;
  minSolved?: number;
}) {
  const now = new Date();
  let dateFilter: Date | undefined;

  if (filters?.active === "today") {
    dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (filters?.active === "week") {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (filters?.active === "month") {
    dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const users = await prisma.user.findMany({
    where: dateFilter ? { lastActive: { gte: dateFilter } } : undefined,
    include: {
      problems: {
        where: { done: true },
        include: {
          problem: {
            include: { pattern: { select: { name: true, slug: true } } },
          },
        },
      },
    },
    orderBy: { lastActive: "desc" },
  });

  return users.map((u) => {
    const solvedDates = u.problems
      .filter((up) => up.solvedOn)
      .map((up) => up.solvedOn!);

    // Calculate streak inline
    const uniqueDays = Array.from(
      new Set(
        solvedDates.map((d) => d.toISOString().split("T")[0])
      )
    ).sort((a, b) => b.localeCompare(a));

    let streak = 0;
    const today = now.toISOString().split("T")[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < uniqueDays.length; i++) {
        const prev = new Date(uniqueDays[i - 1]).getTime();
        const curr = new Date(uniqueDays[i]).getTime();
        if (prev - curr <= 24 * 60 * 60 * 1000 + 1000) {
          streak++;
        } else break;
      }
    }

    const patternsStarted = new Set(
      u.problems.map((up) => up.problem.pattern.name)
    ).size;

    const daysSinceFirst = Math.max(
      1,
      Math.ceil(
        (now.getTime() - u.firstSeen.getTime()) / (24 * 60 * 60 * 1000)
      )
    );
    const avgPerDay = +(u.problems.length / daysSinceFirst).toFixed(1);

    return {
      id: u.id,
      firstSeen: u.firstSeen.toISOString(),
      lastActive: u.lastActive.toISOString(),
      solved: u.problems.length,
      patternsStarted,
      streak,
      avgPerDay,
      solveHistory: u.problems.map((up) => ({
        problem: up.problem.title,
        pattern: up.problem.pattern.name,
        date: up.solvedOn?.toISOString() ?? null,
      })),
    };
  });
}

// ── Admin Problems ────────────────────────────
export async function getAdminProblems(filters?: {
  patternId?: number;
  difficulty?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.patternId) where.patternId = filters.patternId;
  if (filters?.difficulty) where.difficulty = filters.difficulty;
  if (filters?.search) where.title = { contains: filters.search };

  const problems = await prisma.problem.findMany({
    where,
    include: {
      pattern: { select: { name: true, slug: true } },
      users: { where: { done: true } },
    },
    orderBy: [{ patternId: "asc" }, { srNo: "asc" }],
  });

  const totalUsers = await prisma.user.count();

  return problems.map((p) => ({
    id: p.id,
    srNo: p.srNo,
    title: p.title,
    url: p.url,
    difficulty: p.difficulty,
    tags: p.tags,
    patternName: p.pattern.name,
    patternSlug: p.pattern.slug,
    patternId: p.patternId,
    usersSolved: p.users.length,
    solveRate:
      totalUsers > 0 ? Math.round((p.users.length / totalUsers) * 100) : 0,
  }));
}

// ── Broadcasts (admin) ────────────────────────
export async function getBroadcasts() {
  return prisma.broadcast.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createBroadcast(message: string) {
  // Deactivate all existing
  await prisma.broadcast.updateMany({
    where: { active: true },
    data: { active: false },
  });
  const broadcast = await prisma.broadcast.create({
    data: { message, active: true },
  });
  revalidatePath("/");
  return broadcast;
}

export async function toggleBroadcast(id: number) {
  const existing = await prisma.broadcast.findUnique({ where: { id } });
  if (!existing) return;

  if (!existing.active) {
    // Deactivate all others first
    await prisma.broadcast.updateMany({
      where: { active: true },
      data: { active: false },
    });
  }

  await prisma.broadcast.update({
    where: { id },
    data: { active: !existing.active },
  });
  revalidatePath("/");
}

export async function deleteBroadcast(id: number) {
  await prisma.broadcast.delete({ where: { id } });
  revalidatePath("/");
}

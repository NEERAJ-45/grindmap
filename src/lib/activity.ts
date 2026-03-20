import { prisma } from "./db";

export type ActivityAction = "solve" | "add" | "new_user";

export async function logActivity(params: {
  userId: string;
  action: ActivityAction;
  problemId?: number;
  patternId?: number;
  meta?: Record<string, unknown>;
}) {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      problemId: params.problemId ?? null,
      patternId: params.patternId ?? null,
      meta: params.meta ? JSON.stringify(params.meta) : null,
    },
  });
}

import { prisma } from "./db";

export type ActivityAction =
  | "solve"
  | "add"
  | "new_user"
  | "sd_complete"
  | "task_complete"
  | "project_update";

export type ActivityDomain = "dsa" | "system_design" | "task" | "project";

export async function logActivity(params: {
  userId: string;
  action: ActivityAction;
  domain?: ActivityDomain;
  problemId?: string;
  patternId?: string;
  meta?: Record<string, unknown>;
}) {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      domain: params.domain ?? "dsa",
      problemId: params.problemId ?? null,
      patternId: params.patternId ?? null,
      meta: params.meta ? JSON.stringify(params.meta) : null,
    },
  });
}

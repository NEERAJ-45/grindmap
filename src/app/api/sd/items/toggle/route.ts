import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

export async function POST(request: Request) {
  try {
    const { userId, sdItemId, done } = await request.json();
    if (!userId || !sdItemId || typeof done !== "boolean") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.userSDItem.findUnique({
      where: { userId_sdItemId: { userId, sdItemId } },
    });

    if (existing) {
      await prisma.userSDItem.update({
        where: { id: existing.id },
        data: { done, completedOn: done ? new Date() : null },
      });
    } else {
      await prisma.userSDItem.create({
        data: { userId, sdItemId, done, completedOn: done ? new Date() : null },
      });
    }

    if (done) {
      const item = await prisma.sDItem.findUnique({
        where: { id: sdItemId },
        select: { topicId: true },
      });
      await logActivity({
        userId,
        action: "sd_complete",
        domain: "system_design",
        meta: { sdItemId, topicId: item?.topicId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

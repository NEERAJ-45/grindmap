"use server";

import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

// ── Read ──────────────────────────────────────
export async function getSDTopics() {
  return prisma.sDTopic.findMany({
    include: {
      items: {
        include: { users: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getSDTopicBySlug(slug: string) {
  return prisma.sDTopic.findUnique({
    where: { slug },
    include: {
      items: {
        include: { users: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

// ── User actions ──────────────────────────────
export async function toggleSDItemDone(
  userId: string,
  sdItemId: string,
  done: boolean
) {
  const existing = await prisma.userSDItem.findUnique({
    where: { userId_sdItemId: { userId, sdItemId } },
  });

  if (existing) {
    await prisma.userSDItem.update({
      where: { id: existing.id },
      data: {
        done,
        completedOn: done ? new Date() : null,
      },
    });
  } else {
    await prisma.userSDItem.create({
      data: {
        userId,
        sdItemId,
        done,
        completedOn: done ? new Date() : null,
      },
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

  revalidatePath("/system-design");
  revalidatePath("/stats");
}

export async function updateSDNotes(
  userId: string,
  sdItemId: string,
  notes: string
) {
  await prisma.userSDItem.upsert({
    where: { userId_sdItemId: { userId, sdItemId } },
    create: { userId, sdItemId, notes },
    update: { notes },
  });
}

// ── Admin CRUD ────────────────────────────────
export async function createSDTopic(data: {
  name: string;
  slug: string;
  icon: string;
  description?: string;
  order?: number;
}) {
  const topic = await prisma.sDTopic.create({ data });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
  return topic;
}

export async function updateSDTopic(
  id: string,
  data: { name?: string; slug?: string; icon?: string; description?: string; order?: number }
) {
  const topic = await prisma.sDTopic.update({ where: { id }, data });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
  return topic;
}

export async function deleteSDTopic(id: string) {
  await prisma.sDTopic.delete({ where: { id } });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
}

export async function addSDItems(
  topicId: string,
  items: {
    title: string;
    url: string;
    type: string;
    difficulty: string;
  }[]
) {
  await Promise.all(
    items.map((item) =>
      prisma.sDItem.create({ data: { ...item, topicId } })
    )
  );
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
  return items.length;
}

export async function updateSDItem(
  id: string,
  data: { title?: string; url?: string; type?: string; difficulty?: string }
) {
  await prisma.sDItem.update({ where: { id }, data });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
}

export async function deleteSDItem(id: string) {
  await prisma.sDItem.delete({ where: { id } });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
}

export async function deleteSDItems(ids: string[]) {
  await prisma.sDItem.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/system-design");
  revalidatePath("/admin/system-design");
}

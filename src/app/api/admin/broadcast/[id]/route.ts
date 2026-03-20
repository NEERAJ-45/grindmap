import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!cookieStore.get("grindmap_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const broadcastId = parseInt(id);
  const existing = await prisma.broadcast.findUnique({ where: { id: broadcastId } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!existing.active) {
    await prisma.broadcast.updateMany({ where: { active: true }, data: { active: false } });
  }

  await prisma.broadcast.update({ where: { id: broadcastId }, data: { active: !existing.active } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!cookieStore.get("grindmap_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.broadcast.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("Operation Breakout_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  await prisma.broadcast.updateMany({ where: { active: true }, data: { active: false } });
  const broadcast = await prisma.broadcast.create({ data: { message, active: true } });

  return NextResponse.json(broadcast);
}

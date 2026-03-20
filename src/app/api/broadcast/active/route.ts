import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const broadcast = await prisma.broadcast.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(broadcast);
}

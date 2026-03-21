import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const topics = await prisma.sDTopic.findMany({
      include: {
        items: {
          include: { users: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(topics);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

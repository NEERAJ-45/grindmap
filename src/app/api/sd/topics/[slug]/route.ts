import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const topic = await prisma.sDTopic.findUnique({
      where: { slug },
      include: {
        items: {
          include: { users: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const patterns = await prisma.pattern.findMany({
      include: {
        problems: {
          include: { users: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(patterns);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

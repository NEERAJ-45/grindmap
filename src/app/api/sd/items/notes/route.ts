import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, sdItemId, notes } = await request.json();
    if (!userId || !sdItemId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.userSDItem.upsert({
      where: { userId_sdItemId: { userId, sdItemId } },
      create: { userId, sdItemId, notes },
      update: { notes },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

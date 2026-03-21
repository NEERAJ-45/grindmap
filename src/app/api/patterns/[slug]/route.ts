import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const pattern = await prisma.pattern.findUnique({
      where: { slug },
      include: {
        problems: {
          include: { users: true },
          orderBy: { srNo: "asc" },
        },
      },
    });

    if (!pattern) {
      return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
    }

    return NextResponse.json(pattern);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

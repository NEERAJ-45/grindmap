import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const count = await prisma.authUser.count();
  return NextResponse.json({ exists: count > 0 });
}

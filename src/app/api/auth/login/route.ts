import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  // Check if any user exists — if not, block login (must setup first)
  const count = await prisma.authUser.count();
  if (count === 0) {
    return NextResponse.json(
      { error: "No account exists. Please set up first." },
      { status: 404 }
    );
  }

  const user = await prisma.authUser.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("operation_breakout_auth", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
  return response;
}

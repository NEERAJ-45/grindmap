import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { username, password, confirmPassword } = await request.json();

  if (!username || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  // Only allow setup if no users exist
  const count = await prisma.authUser.count();
  if (count > 0) {
    return NextResponse.json(
      { error: "Account already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.authUser.create({
    data: { username, hashedPassword },
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("operation_breakout_auth", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return response;
}

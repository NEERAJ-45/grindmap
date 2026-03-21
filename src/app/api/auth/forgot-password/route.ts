import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, securityAnswer, newPassword, confirmPassword } =
      await request.json();

    if (!username || !securityAnswer || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.authUser.findUnique({
      where: { username },
    });

    if (!user || !user.securityAnswer) {
      return NextResponse.json(
        { error: "Invalid username or security answer" },
        { status: 401 }
      );
    }

    const validAnswer = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );
    if (!validAnswer) {
      return NextResponse.json(
        { error: "Invalid username or security answer" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.authUser.update({
      where: { username },
      data: { hashedPassword },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

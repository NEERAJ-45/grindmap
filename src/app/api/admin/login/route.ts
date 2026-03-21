import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === (process.env.ADMIN_PASSWORD || "Operation Breakout_admin")) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("Operation Breakout_admin", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

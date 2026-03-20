import { NextResponse } from "next/server";
import { fetchDifficulty } from "@/lib/leetcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ difficulty: "Unknown" });
  }

  const difficulty = await fetchDifficulty(slug);
  return NextResponse.json({ difficulty });
}

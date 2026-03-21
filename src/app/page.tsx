import HomeClient from "./HomeClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/patterns`, { 
    cache: "no-store",
    headers: { Cookie: cookieHeader }
  });
  const patterns = await res.json();

  const serialized = patterns.map((p: any) => ({
    ...p,
    problems: p.problems.map((pr: any) => ({
      ...pr,
      users: pr.users.map((u: any) => ({
        userId: u.userId,
        done: u.done,
        solvedOn: u.solvedOn,
      })),
    })),
  }));

  return <HomeClient patterns={serialized} />;
}

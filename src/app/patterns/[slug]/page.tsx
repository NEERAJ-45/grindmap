import PatternPageClient from "./PatternPageClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/patterns/${slug}`,
    { 
      cache: "no-store",
      headers: { Cookie: cookieHeader }
    }
  );

  if (!res.ok) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  const pattern = await res.json();

  const serialized = {
    ...pattern,
    problems: pattern.problems.map((p: any) => ({
      ...p,
      users: p.users.map((u: any) => ({
        userId: u.userId,
        done: u.done,
        solvedOn: u.solvedOn,
        notes: u.notes,
      })),
    })),
  };

  return <PatternPageClient pattern={serialized} />;
}

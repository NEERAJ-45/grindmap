import { getPatternBySlug } from "@/app/actions";
import { notFound } from "next/navigation";
import PatternPageClient from "./PatternPageClient";

export const dynamic = "force-dynamic";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);

  if (!pattern) notFound();

  const serialized = {
    ...pattern,
    problems: pattern.problems.map((p) => ({
      ...p,
      users: p.users.map((u) => ({
        userId: u.userId,
        done: u.done,
        solvedOn: u.solvedOn,
        notes: u.notes,
      })),
    })),
  };

  return <PatternPageClient pattern={serialized} />;
}

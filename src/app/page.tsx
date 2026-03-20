import { getPatterns } from "@/app/actions";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const patterns = await getPatterns();

  const serialized = patterns.map((p) => ({
    ...p,
    problems: p.problems.map((pr) => ({
      ...pr,
      users: pr.users.map((u) => ({
        userId: u.userId,
        done: u.done,
        solvedOn: u.solvedOn,
      })),
    })),
  }));

  return <HomeClient patterns={serialized} />;
}

import { SDHomeClient } from "./SDHomeClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function SystemDesignPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/sd/topics`,
    { 
      cache: "no-store",
      headers: { Cookie: cookieHeader }
    }
  );
  const topics = await res.json();

  return <SDHomeClient initialTopics={topics} />;
}

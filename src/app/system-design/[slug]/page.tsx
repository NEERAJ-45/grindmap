import { SDTopicDetailClient } from "./SDTopicDetailClient";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function SystemDesignTopicPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/sd/topics/${params.slug}`,
    { 
      cache: "no-store",
      headers: { Cookie: cookieHeader }
    }
  );

  if (!res.ok) {
    notFound();
  }

  const topic = await res.json();
  return <SDTopicDetailClient topic={topic} />;
}

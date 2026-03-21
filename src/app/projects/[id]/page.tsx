import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/projects/${params.id}`,
    { 
      cache: "no-store",
      headers: { Cookie: cookieHeader }
    }
  );

  if (!res.ok) {
    notFound();
  }

  const project = await res.json();
  return <ProjectDetail initialProject={project} />;
}

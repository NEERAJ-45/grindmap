import { getProjectById } from "@/app/actions/project-actions";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetail initialProject={project} />;
}

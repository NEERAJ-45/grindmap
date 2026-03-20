import { getSDTopicBySlug } from "@/app/actions/sd-actions";
import { SDTopicDetailClient } from "./SDTopicDetailClient";
import { notFound } from "next/navigation";

export default async function SystemDesignTopicPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const topic = await getSDTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  return <SDTopicDetailClient topic={topic} />;
}

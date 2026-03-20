"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { SDItemsTable } from "@/components/system-design/SDItemsTable";
import { type SDTopic, type SDItem, type UserSDItem } from "@prisma/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSDIcon } from "@/lib/sd-icons";

interface TopicWithItems extends SDTopic {
  items: (SDItem & { users: UserSDItem[] })[];
}

export function SDTopicDetailClient({ topic }: { topic: TopicWithItems }) {
  const userId = useFingerprint();
  const IconComponent = getSDIcon(topic.icon);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/system-design"
          className="mb-8 inline-flex items-center gap-1 text-sm text-[#6b7280] transition-colors hover:text-[#ededed]"
        >
          <ChevronLeft size={16} />
          Back to Topics
        </Link>

        <div className="mb-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#333]">
            <IconComponent size={24} className="text-[#6b7280]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#ededed]">{topic.name}</h1>
          <p className="mt-2 text-[#8b92a0]">Master the core concepts of {topic.name}</p>
        </div>

        {userId ? (
          topic.items.length > 0 ? (
            <SDItemsTable items={topic.items} userId={userId} />
          ) : (
            <div className="rounded-xl border border-[#1f1f1f] bg-[#111] py-12 text-center text-sm text-[#6b7280]">
              No resources added for this topic yet.
            </div>
          )
        ) : (
          <div className="py-20 text-center flex justify-center">
            <div className="h-6 w-6 animate-pulse rounded bg-[#1f1f1f]" />
          </div>
        )}
      </div>
    </div>
  );
}

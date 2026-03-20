"use client";

import { useFingerprint } from "@/hooks/useFingerprint";
import { SDTopicCard } from "@/components/system-design/SDTopicCard";
import { LightningEffect } from "@/components/ui/lightning-effect";
import { Layers } from "lucide-react";
import { type SDTopic, type SDItem, type UserSDItem } from "@prisma/client";

interface TopicWithItems extends SDTopic {
  items: (SDItem & { users: UserSDItem[] })[];
}

export function SDHomeClient({ initialTopics }: { initialTopics: TopicWithItems[] }) {
  const userId = useFingerprint();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
              <Layers size={20} className="text-[#3b82f6]" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              System Design
            </h1>
          </div>
          <p className="max-w-xl text-base text-[#8b92a0]">
            Master large-scale distributed systems. Architectures, trade-offs, and critical components.
          </p>
        </div>
        <LightningEffect />
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-medium text-[#ededed]">Topics</h2>
        </div>

        {userId ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialTopics.length > 0 ? (
              initialTopics.map((topic) => (
                <SDTopicCard key={topic.id} topic={topic} userId={userId} />
              ))
            ) : (
              <p className="col-span-full text-sm text-[#6b7280]">No topics available yet.</p>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-md bg-[#1f1f1f]" />
            <p className="text-sm text-[#6b7280]">Initializing your workspace...</p>
          </div>
        )}
      </main>
    </div>
  );
}

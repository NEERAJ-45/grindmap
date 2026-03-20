"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#1f1f1f]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-5xl font-medium tracking-tight text-white">
          GrindMap
        </h1>
        <p className="mt-3 text-base text-[#6b7280]">
          Track your DSA prep. Pattern by pattern.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="#patterns"
            className="rounded-md border border-[#1f1f1f] bg-transparent px-4 py-2 text-sm text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
          >
            View Patterns
          </Link>
          <Link
            href="/stats"
            className="rounded-md border border-[#1f1f1f] bg-transparent px-4 py-2 text-sm text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
          >
            Your Stats
          </Link>
        </div>
      </div>
      <BackgroundBeams className="opacity-40" />
    </section>
  );
}

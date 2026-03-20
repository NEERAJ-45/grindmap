"use client";

import { LightningEffect } from "@/components/ui/lightning-effect";
import Link from "next/link";
import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-[#0a0a0a]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <Zap size={24} className="text-[#3b82f6]" />
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            Operation Breakout
          </h1>
        </div>
        <p className="max-w-xl text-lg text-[#8b92a0]">
          Your supreme command center for system execution. Track DSA mastery, crush System Design architectures, and ship active projects.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="#patterns"
            className="rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb]"
          >
            Start Grinding
          </Link>
          <Link
            href="/system-design"
            className="rounded-lg border border-[#1f1f1f] bg-[#111] px-5 py-2.5 text-sm font-medium text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
          >
            System Design
          </Link>
        </div>
      </div>
      <LightningEffect />
    </section>
  );
}

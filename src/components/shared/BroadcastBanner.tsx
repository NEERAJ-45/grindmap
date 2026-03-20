"use client";

import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

export function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState<{
    id: number;
    message: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedId = localStorage.getItem("dismissed_broadcast");

    fetch("/api/broadcast/active")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) {
          if (dismissedId === String(data.id)) {
            setDismissed(true);
          } else {
            setBroadcast(data);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!broadcast || dismissed) return null;

  return (
    <div className="border-b border-[#1f1f1f] bg-[#111] px-6 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Info size={14} strokeWidth={1.5} className="text-[#6b7280]" />
          <span className="text-sm">{broadcast.message}</span>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(
              "dismissed_broadcast",
              String(broadcast.id)
            );
            setDismissed(true);
          }}
          className="text-[#6b7280] transition-colors hover:text-[#ededed]"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

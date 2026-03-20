"use client";

import { useEffect, useState } from "react";
import { getFingerprint } from "@/lib/fingerprint";

export function useFingerprint() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check sessionStorage first to avoid redundant work
    const cached = sessionStorage.getItem("ob_fingerprint");
    if (cached) {
      setUserId(cached);
      return;
    }

    getFingerprint().then((id) => {
      setUserId(id);
      sessionStorage.setItem("ob_fingerprint", id);
      // Upsert once per session only
      fetch("/api/user/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      }).catch(() => {});
    });
  }, []);

  return userId;
}

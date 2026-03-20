"use client";

import { useEffect, useState } from "react";
import { getFingerprint } from "@/lib/fingerprint";

export function useFingerprint() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getFingerprint().then((id) => {
      setUserId(id);
      // Upsert user on every page load
      fetch("/api/user/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      }).catch(() => {});
    });
  }, []);

  return userId;
}

"use client";

import { useState, useEffect } from "react";

export function useFingerprint() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Hardcoded for testing the NEERAJ04 seeded progress
    setUserId("NEERAJ04");
  }, []);

  return userId;
}

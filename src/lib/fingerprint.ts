export async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("Operation Breakout_uid");
  if (stored) return stored;

  try {
    const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    localStorage.setItem("Operation Breakout_uid", visitorId);
    return visitorId;
  } catch {
    const fallbackId = crypto.randomUUID();
    localStorage.setItem("Operation Breakout_uid", fallbackId);
    return fallbackId;
  }
}

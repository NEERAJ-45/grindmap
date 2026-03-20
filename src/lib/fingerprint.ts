export async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("grindmap_uid");
  if (stored) return stored;

  try {
    const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    localStorage.setItem("grindmap_uid", visitorId);
    return visitorId;
  } catch {
    const fallbackId = crypto.randomUUID();
    localStorage.setItem("grindmap_uid", fallbackId);
    return fallbackId;
  }
}

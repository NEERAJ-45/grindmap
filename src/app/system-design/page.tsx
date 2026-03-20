import { getSDTopics, upsertUser } from "@/app/actions";
import { getSDTopics as getSDTopicsNew } from "@/app/actions/sd-actions"; 
import { SDHomeClient } from "./SDHomeClient";
import { cookies } from "next/headers";

// Just simple get Fingerprint or fallback to basic ID logic
async function verifyUser() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("operation_breakout_auth");
  // Assuming a single standard user ID for this simple MVP or from fingerprint
  // In a real app we'd decode token. Here we use a generic 'user-1' if tracking anonymously.
  // Wait, existing logic uses useFingerprint hook on client. 
  return "generic-user-id"; 
}

export default async function SystemDesignPage() {
  // We'll pass topics to client component that has useFingerprint
  const topics = await getSDTopicsNew();

  return <SDHomeClient initialTopics={topics} />;
}

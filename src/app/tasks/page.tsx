import { getTasks } from "@/app/actions/task-actions";
import { TasksClient } from "./TasksClient";
import { cookies } from "next/headers";

async function verifyUser() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("operation_breakout_auth");
  return "generic-user-id";
}

export default async function TasksPage() {
  // We'll pass an empty array initially, and let client fetch if we rely entirely on fingerprint DB fetches
  // But wait, server doesn't know the fingerprint ID. Client must fetch it.
  // We can just use an empty array and let the client do a useEffect fetch from a Server Action using the fingerprint
  // OR we just use a Client Component entirely.
  return <TasksClient />;
}

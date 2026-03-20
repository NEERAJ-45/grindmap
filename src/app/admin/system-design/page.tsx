import { getSDTopics } from "@/app/actions/sd-actions";
import { AdminSDClient } from "./AdminSDClient";

export default async function AdminSystemDesignPage() {
  const topics = await getSDTopics();

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a]">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              System Design Management
            </h1>
          </div>
          <AdminSDClient initialTopics={topics} />
        </div>
      </div>
    </div>
  );
}

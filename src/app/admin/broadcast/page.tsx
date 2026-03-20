"use client";

import { useEffect, useState, useTransition } from "react";
import { getBroadcasts, createBroadcast, toggleBroadcast, deleteBroadcast } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Broadcast = { id: number; message: string; active: boolean; createdAt: Date };

export default function AdminBroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = () => getBroadcasts().then(setBroadcasts);
  useEffect(() => { load(); }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    startTransition(async () => {
      await createBroadcast(message);
      setMessage("");
      load();
      toast.success("Broadcast sent");
    });
  };

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleBroadcast(id);
      load();
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteBroadcast(id);
      load();
      toast.success("Broadcast deleted");
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <h1 className="text-2xl font-medium tracking-tight mb-6">Broadcast</h1>

      <div className="mb-8 rounded-lg border border-[#1f1f1f] bg-[#111] p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message to all users..."
          className="h-24 w-full resize-none rounded-md border border-[#1f1f1f] bg-[#111] p-3 text-sm placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          className="mt-3 rounded-md bg-white px-4 py-2 text-sm text-black hover:bg-[#e5e5e5] disabled:opacity-50"
        >
          Send Broadcast
        </button>
      </div>

      <h2 className="text-sm font-medium mb-3">History</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Message</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Sent At</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Status</th>
            <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-[#6b7280]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {broadcasts.map((b) => (
            <tr key={b.id} className="border-b border-[#1f1f1f] hover:bg-[#141414]">
              <td className="max-w-[400px] truncate px-3 py-2.5 text-sm">{b.message}</td>
              <td className="px-3 py-2.5 text-sm text-[#6b7280]">{format(new Date(b.createdAt), "MMM d, yyyy HH:mm")}</td>
              <td className="px-3 py-2.5">
                <span className={cn("text-xs font-medium", b.active ? "text-[#22c55e]" : "text-[#6b7280]")}>
                  {b.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-2.5 flex gap-2">
                <button onClick={() => handleToggle(b.id)} className="text-xs text-[#6b7280] hover:text-white">
                  {b.active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-[#ef4444] hover:text-[#ef4444]/80">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

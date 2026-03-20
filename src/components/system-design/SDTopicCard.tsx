import Link from "next/link";
import { type SDTopic, type SDItem, type UserSDItem } from "@prisma/client";
import { getSDIcon } from "@/lib/sd-icons";

interface SDTopicCardProps {
  topic: SDTopic & {
    items: (SDItem & { users: UserSDItem[] })[];
  };
  userId: string;
}

export function SDTopicCard({ topic, userId }: SDTopicCardProps) {
  const totalItems = topic.items.length;
  const completedItems = topic.items.filter((item) =>
    item.users.some((u) => u.userId === userId && u.done)
  ).length;

  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const IconComponent = getSDIcon(topic.icon);

  return (
    <Link
      href={`/system-design/${topic.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all hover:border-[#333] hover:bg-[#151515]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f1f1f]">
          <IconComponent size={20} className="text-[#6b7280]" />
        </div>
        <h3 className="text-lg font-medium text-[#ededed]">{topic.name}</h3>
        <p className="mt-1 text-sm text-[#6b7280]">
          {completedItems} of {totalItems} completed
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1f1f1f]">
          <div
            className="h-full rounded-full bg-[#3b82f6] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-[#6b7280]">{progress}%</span>
      </div>
    </Link>
  );
}

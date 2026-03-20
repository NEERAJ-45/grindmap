"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Layers, List, Users, BarChart2, Megaphone } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Layers, label: "System Design", href: "/admin/system-design" },
  { icon: Layers, label: "Patterns", href: "/admin/patterns" },
  { icon: List, label: "Problems", href: "/admin/problems" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart2, label: "Analytics", href: "/admin/analytics" },
  { icon: Megaphone, label: "Broadcast", href: "/admin/broadcast" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[220px] flex-col border-r border-[#1f1f1f] bg-[#0d0d0d] px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-3">
        <span className="text-sm font-medium">Operation Breakout</span>
        <span className="rounded-sm bg-[#1a1a1a] px-2 py-0.5 text-xs text-[#3b82f6]">Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#6b7280] hover:text-white"
              )}
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="px-3 text-xs text-[#6b7280] transition-colors hover:text-white"
      >
        Exit Admin
      </Link>
    </aside>
  );
}

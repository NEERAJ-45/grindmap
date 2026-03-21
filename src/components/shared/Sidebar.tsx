"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Brain,
  Layers,
  CheckSquare,
  FolderKanban,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Brain, label: "DSA", href: "/" },
  { icon: Layers, label: "System Design", href: "/system-design" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: BarChart3, label: "Stats", href: "/stats" },
  { icon: ShieldCheck, label: "Admin", href: "/admin" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-[#1f1f1f] bg-[#0a0a0a] transition-[width] duration-200 ease-in-out"
      style={{ width: collapsed ? 64 : 220 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#1f1f1f] px-3 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10">
          <Zap size={16} className="text-[#3b82f6]" />
        </div>
        {!collapsed && (
          <span className="overflow-hidden whitespace-nowrap text-sm font-semibold">
            Breakout
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all",
                isActive
                  ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                  : "text-[#6b7280] hover:bg-[#111] hover:text-[#ededed]"
              )}
            >
              <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
              {!collapsed && (
                <span className="overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1f1f1f] px-2 py-3 space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#6b7280] transition-all hover:bg-[#111] hover:text-[#ef4444]"
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && (
            <span className="overflow-hidden whitespace-nowrap">
              Logout
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#6b7280] transition-all hover:bg-[#111] hover:text-[#ededed]"
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={1.5} className="shrink-0" />
          ) : (
            <ChevronLeft size={18} strokeWidth={1.5} className="shrink-0" />
          )}
          {!collapsed && (
            <span className="overflow-hidden whitespace-nowrap">
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

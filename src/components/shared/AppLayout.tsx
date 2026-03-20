"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isExcluded = pathname === "/login" || pathname?.startsWith("/admin");

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <main className="flex-1 w-full sm:pl-[220px] transition-all duration-200">
        <div id="app-main-content">
          {children}
        </div>
      </main>
    </div>
  );
}

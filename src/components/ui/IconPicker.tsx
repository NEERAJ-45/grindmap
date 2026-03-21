"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Get all icon names from Lucide
const allIconNames = Object.keys(LucideIcons).filter(
  (key) => key !== "createLucideIcon" && typeof (LucideIcons as any)[key] === "function" || typeof (LucideIcons as any)[key] === "object"
);

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return allIconNames.slice(0, 100); // Show first 100 when empty
    return allIconNames.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 200); // Cap results for performance
  }, [searchTerm]);

  const SelectedIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
      >
        <div className="flex items-center gap-2">
          <SelectedIcon size={16} strokeWidth={1.5} />
          <span>{value || "Select Icon"}</span>
        </div>
        <LucideIcons.ChevronDown size={14} className="text-[#6b7280]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-12 z-50 w-72 rounded-lg border border-[#1f1f1f] bg-[#0d0d0d] p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b7280]" size={14} />
              <input
                autoFocus
                className="w-full rounded-md border border-[#1f1f1f] bg-[#111] py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#3b82f6]"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid max-h-60 grid-cols-5 gap-1 overflow-y-auto pr-1 custom-scrollbar">
              {filteredIcons.map((name) => {
                const Icon = (LucideIcons as any)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-md transition-colors hover:bg-[#1f1f1f] hover:text-[#ededed]",
                      value === name ? "bg-[#3b82f6] text-white" : "text-[#6b7280]"
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-5 py-4 text-center text-xs text-[#6b7280]">
                  No icons found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

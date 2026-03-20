"use client";

import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <BackgroundBeams />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shake ? [0, -8, 8, -8, 8, 0] : 0,
        }}
        transition={{ duration: shake ? 0.3 : 0.2 }}
        className="relative z-10 w-80 rounded-lg border border-[#1f1f1f] bg-[#111] p-6"
      >
        <h1 className="text-lg font-medium">GrindMap</h1>
        <p className="mt-1 text-xs text-[#6b7280]">Admin Access</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            className="w-full rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-2 text-sm text-[#ededed] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-xs text-[#ef4444]">Invalid password</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#e5e5e5]"
          >
            Enter
          </button>
        </form>
      </motion.div>
    </div>
  );
}

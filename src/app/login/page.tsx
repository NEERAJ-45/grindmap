"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"loading" | "setup" | "login">("loading");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => setMode(data.exists ? "login" : "setup"))
      .catch(() => setMode("setup"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "setup" ? "/api/auth/setup" : "/api/auth/login";
      const body =
        mode === "setup"
          ? { username, password, confirmPassword }
          : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-md bg-[#1a1a1a]" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackgroundBeams className="opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shake ? [0, -8, 8, -8, 8, 0] : 0,
        }}
        transition={{ duration: shake ? 0.3 : 0.3 }}
        className="relative z-10 w-[380px] rounded-xl border border-[#1f1f1f] bg-[#0d0d0d]/90 p-8 backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <Zap size={20} className="text-[#3b82f6]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Operation Breakout
            </h1>
            <p className="text-xs text-[#6b7280]">
              {mode === "setup" ? "Create your account" : "Welcome back"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter username"
              className="w-full rounded-lg border border-[#1f1f1f] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] placeholder:text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password"
              className="w-full rounded-lg border border-[#1f1f1f] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] placeholder:text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
              required
            />
          </div>

          {mode === "setup" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-[#1f1f1f] bg-[#111] px-3.5 py-2.5 text-sm text-[#ededed] placeholder:text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                required
              />
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#ef4444]"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#3b82f6] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "..."
              : mode === "setup"
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {mode === "setup" && (
          <p className="mt-4 text-center text-xs text-[#4b5563]">
            This is a one-time setup. Your credentials are stored securely.
          </p>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email yoki parol noto'g'ri");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="w-full max-w-md">
        <h1 className="font-display mb-6 text-2xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="glass w-full rounded-xl px-4 py-3 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            className="glass w-full rounded-xl px-4 py-3 outline-none"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">Kirish</Button>
        </form>
      </GlassCard>
    </div>
  );
}

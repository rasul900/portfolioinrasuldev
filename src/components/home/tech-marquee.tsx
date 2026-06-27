"use client";

import { Marquee } from "@/components/ui/marquee";

const TECH = [
  "React", "Next.js", "TypeScript", "Three.js", "Node.js", "MongoDB",
  "GSAP", "Framer Motion", "TailwindCSS", "Telegram Bot API", "Stripe",
  "Redis", "Docker", "GraphQL", "WebSocket", "Cloudinary",
];

export function TechMarquee() {
  return (
    <div className="relative border-y border-white/[0.06] bg-[#0a0908]/40 backdrop-blur-sm">
      <Marquee items={TECH} speed={40} />
      <Marquee items={[...TECH].reverse()} speed={50} reverse className="-mt-2 opacity-50" />
    </div>
  );
}

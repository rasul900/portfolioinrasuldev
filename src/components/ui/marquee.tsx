"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
  reverse?: boolean;
}

export function Marquee({ items, speed = 30, className, reverse }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden py-4", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-space to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-space to-transparent" />
      <div
        className="flex w-max gap-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 font-mono text-sm tracking-wider text-slate/60 uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-azure/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

const BLOBS = [
  { color: "#2563EB", size: 520, x: "10%", y: "15%", delay: 0 },
  { color: "#7C3AED", size: 420, x: "75%", y: "10%", delay: 1.5 },
  { color: "#06B6D4", size: 380, x: "60%", y: "65%", delay: 0.8 },
  { color: "#E10098", size: 300, x: "5%", y: "70%", delay: 2 },
  { color: "#3B82F6", size: 260, x: "40%", y: "45%", delay: 1.2 },
];

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: (i % 3) + 1,
  delay: (i % 5) * 0.4,
}));

export function NebulaBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="nebula-mesh absolute inset-0 opacity-60" />
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen blur-[100px]"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: `radial-gradient(circle, ${b.color}55 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
      {STARS.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 2 + s.delay, repeat: Infinity, delay: s.delay }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="nebula-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nebula-grid)" />
      </svg>
    </div>
  );
}

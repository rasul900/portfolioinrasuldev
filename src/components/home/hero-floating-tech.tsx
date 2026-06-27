"use client";

import { motion } from "framer-motion";

const BADGES = [
  { label: "React", color: "#61DAFB", x: "8%", y: "18%", delay: 0 },
  { label: "Next.js", color: "#fff", x: "88%", y: "22%", delay: 0.2 },
  { label: "Three.js", color: "#3B82F6", x: "5%", y: "65%", delay: 0.4 },
  { label: "Node.js", color: "#339933", x: "90%", y: "58%", delay: 0.6 },
  { label: "GSAP", color: "#88CE02", x: "12%", y: "42%", delay: 0.8 },
  { label: "MongoDB", color: "#47A248", x: "85%", y: "78%", delay: 1 },
  { label: "TypeScript", color: "#3178C6", x: "78%", y: "38%", delay: 1.2 },
  { label: "Telegram", color: "#2CA5E0", x: "18%", y: "82%", delay: 1.4 },
];

export function HeroFloatingTech() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
      {BADGES.map((b) => (
        <motion.span
          key={b.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.05, 1],
            y: [0, -12, 0],
          }}
          transition={{
            delay: 5 + b.delay,
            duration: 4 + b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wide backdrop-blur-md"
          style={{
            left: b.x,
            top: b.y,
            color: b.color,
            borderColor: `${b.color}40`,
            background: `${b.color}10`,
            boxShadow: `0 0 20px ${b.color}25`,
          }}
        >
          {b.label}
        </motion.span>
      ))}
    </div>
  );
}

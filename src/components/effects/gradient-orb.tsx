"use client";

import { motion } from "framer-motion";

const colors = {
  blue: "rgba(37, 99, 235, 0.15)",
  purple: "rgba(139, 92, 246, 0.12)",
  cyan: "rgba(6, 182, 212, 0.12)",
};

const positions = {
  left: "top-1/4 -left-32",
  right: "top-1/3 -right-32",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function GradientOrb({
  position = "right",
  color = "blue",
  size = 500,
}: {
  position?: "left" | "right" | "center";
  color?: "blue" | "purple" | "cyan";
  size?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${positions[position]} rounded-full blur-[120px]`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

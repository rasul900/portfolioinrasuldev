"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-[2px] origin-left bg-gradient-to-r from-[#c9a87c] via-[#f5e6c8] to-[#6b8cae] shadow-[0_0_12px_rgba(201,168,124,0.6)]"
    />
  );
}

"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-center bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div className="divider-shine absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a87c]/30 to-transparent" />
    </div>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
};

const piece: Variants = {
  hidden: { y: "110%", rotate: 4, opacity: 0 },
  visible: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SplitTextProps {
  text: string;
  by?: "word" | "char";
  className?: string;
  pieceClassName?: (index: number, total: number) => string;
  stagger?: number;
  delay?: number;
  /** When set, animates on mount instead of on scroll into view. */
  animate?: boolean;
}

/** Masked, staggered text reveal — each piece slides up from behind a clip. */
export function SplitText({
  text,
  by = "word",
  className = "",
  pieceClassName,
  stagger = 0.06,
  delay = 0,
  animate,
}: SplitTextProps) {
  const pieces = by === "word" ? text.split(" ") : Array.from(text);
  const trigger =
    animate === undefined
      ? { whileInView: "visible", viewport: { once: true, margin: "-60px" } }
      : { animate: animate ? "visible" : "hidden" };

  return (
    <motion.span
      aria-label={text}
      role="text"
      className={`inline ${className}`}
      initial="hidden"
      custom={{ stagger, delay }}
      variants={container}
      {...trigger}
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${
            by === "word" && i < pieces.length - 1 ? "mr-[0.28em]" : ""
          }`}
        >
          <motion.span
            variants={piece}
            className={`inline-block will-change-transform ${pieceClassName?.(i, pieces.length) ?? ""}`}
          >
            {p === " " ? " " : p}
          </motion.span>
          {by === "word" && i < pieces.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}

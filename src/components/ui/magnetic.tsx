"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className = "", strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      className={className}
      data-magnetic="true"
      whileHover={{ scale: hovering ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

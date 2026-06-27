"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setVisible(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest(".interactive, a, button, [data-magnetic]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          animate={{
            scale: hovering ? 2 : 1,
            backgroundColor: hovering ? "rgba(59,130,246,0.8)" : "rgba(248,250,252,0.9)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference"
        />
      </motion.div>
      {[1, 2, 3, 4, 5].map((i) => (
        <TrailDot key={i} index={i} x={springX} y={springY} />
      ))}
    </>
  );
}

function TrailDot({
  index,
  x,
  y,
}: {
  index: number;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
}) {
  const delayX = useSpring(x, { stiffness: 200 - index * 20, damping: 20 + index * 2 });
  const delayY = useSpring(y, { stiffness: 200 - index * 20, damping: 20 + index * 2 });

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
      style={{ x: delayX, y: delayY }}
    >
      <div
        className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/40"
        style={{ opacity: 1 - index * 0.18 }}
      />
    </motion.div>
  );
}

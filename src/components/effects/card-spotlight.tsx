"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position into every `.premium-card` as CSS variables,
 * so the stylesheet can paint a soft spotlight that follows the cursor.
 */
export function CardSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      const target = (e.target as Element | null)?.closest?.(".premium-card") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

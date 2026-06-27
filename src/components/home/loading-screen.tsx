"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useUIStore } from "@/store/ui";

const DURATION = 3.5;

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const setLoadingComplete = useUIStore((s) => s.setLoadingComplete);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const counter = { val: 0 };
    const progressTween = gsap.to(counter, {
      val: 100,
      duration: DURATION - 0.4,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.val)),
    });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(".loading-text", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" });
    tl.from(".loading-progress", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    tl.from(".loading-character", { x: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.7");

    const exitTl = gsap.timeline({
      delay: DURATION,
      onComplete: () => {
        setLoadingComplete(true);
        gsap.to(container, {
          opacity: 0,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: () => {
            container.style.display = "none";
          },
        });
      },
    });

    exitTl.to(".loading-content", { opacity: 0, y: -12, duration: 0.4 }, 0);
    exitTl.to(".loading-character", { opacity: 0, x: 24, duration: 0.5 }, 0);

    return () => {
      progressTween.kill();
      tl.kill();
      exitTl.kill();
    };
  }, [setLoadingComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] overflow-hidden bg-black"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="loading-content relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="loading-text max-w-xl">
          <p className="font-display text-sm font-light tracking-[0.45em] text-white/70 uppercase md:text-base">
            RASUL
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-[#f5f0e8] md:text-7xl lg:text-8xl">
            DEV
          </h1>
          <p className="mt-4 text-xs tracking-[0.35em] text-white/40 uppercase md:text-sm">
            Creative Developer
          </p>
        </div>

        <div className="loading-progress mt-12 md:mt-16">
          <div className="flex items-end gap-1">
            <span className="font-mono text-4xl font-bold tabular-nums text-[#f5a623] md:text-5xl">
              {progress}
            </span>
            <span className="mb-1 text-lg text-white/35 md:text-xl">%</span>
          </div>
          <div className="mt-4 h-px w-48 overflow-hidden bg-white/10 md:w-56">
            <div
              className="h-full origin-left bg-[#f5a623] transition-transform duration-150"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </div>
      </div>

      <div className="loading-character pointer-events-none absolute right-0 bottom-0 h-[62vh] w-[min(95vw,580px)] md:h-[78vh] md:w-[min(58vw,720px)]">
        <Image
          src="/loading-hero.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-contain object-bottom object-right"
          sizes="(max-width: 768px) 95vw, 720px"
        />
      </div>
    </div>
  );
}

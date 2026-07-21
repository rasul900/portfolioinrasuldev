"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/store/ui";

gsap.registerPlugin(ScrollTrigger);

export function HeroPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const enter = enterRef.current;
    const floatEl = floatRef.current;
    if (!wrap || !enter || !floatEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enterDelay = useUIStore.getState().loadingComplete || reduceMotion ? 0.2 : 4.35;

    const ctx = gsap.context(() => {
      // Entrance on its own layer — scroll never changes opacity
      gsap.set(enter, { autoAlpha: 0, x: 64, scale: 0.9, filter: "blur(10px)" });

      gsap.to(enter, {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: reduceMotion ? 0.35 : 1.35,
        delay: enterDelay,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(enter, { clearProps: "filter" });
          ScrollTrigger.refresh();
        },
      });

      if (reduceMotion) return;

      gsap.to(floatEl, {
        y: -12,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: enterDelay + 1.2,
      });

      // Parallax only — keeps portrait visible when scrolling back to hero
      gsap.fromTo(
        wrap,
        { yPercent: 0, rotate: 0, scale: 1 },
        {
          yPercent: 18,
          rotate: -4,
          scale: 0.92,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, wrap);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), enterDelay * 1000 + 100);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none relative mx-auto mt-2 flex w-full max-w-[320px] justify-center sm:max-w-[400px] lg:mt-0 lg:mx-0 lg:max-w-[460px] lg:justify-end xl:max-w-[520px]"
      style={{ willChange: "transform" }}
    >
      <div ref={enterRef} className="relative w-full" style={{ visibility: "hidden" }}>
        <div
          aria-hidden
          className="hero-portrait-glow absolute top-[46%] left-1/2 h-[72%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[52%]"
        />

        <div ref={floatRef} className="relative z-10 w-full">
          <Image
            src="/hero-portrait.png"
            alt="Abdurasul"
            width={720}
            height={960}
            priority
            className="hero-portrait-img relative z-10 mx-auto h-auto w-full max-h-[56vh] object-contain object-bottom lg:max-h-[78vh]"
          />
        </div>
      </div>
    </div>
  );
}

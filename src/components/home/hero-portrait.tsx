"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const floatEl = floatRef.current;
    if (!wrap || !floatEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrap,
        { opacity: 0, x: 72, scale: 0.88, filter: "blur(12px)" },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          delay: 4.35,
          ease: "power3.out",
        }
      );

      if (reduceMotion) return;

      gsap.to(floatEl, {
        y: -12,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 5.6,
      });

      gsap.to(wrap, {
        y: 90,
        rotate: -3,
        scale: 0.94,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none relative mx-auto mt-2 flex w-full max-w-[320px] justify-center opacity-0 sm:max-w-[400px] lg:mt-0 lg:mx-0 lg:max-w-[460px] lg:justify-end xl:max-w-[520px]"
    >
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
  );
}

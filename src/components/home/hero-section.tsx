"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { SectionBackdrop } from "@/components/effects/section-backdrop";
import { HeroPortrait } from "@/components/home/hero-portrait";
import { SITE, TYPEWRITER_ROLES } from "@/lib/constants";
import { Camera, ChevronDown, Code, Mail, Send } from "lucide-react";

const SOCIAL = [
  { icon: Send, href: SITE.telegram, label: "Telegram" },
  { icon: Code, href: SITE.github, label: "GitHub" },
  { icon: Camera, href: SITE.instagram, label: "Instagram" },
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

gsap.registerPlugin(ScrollTrigger);

const TITLE = "DEV";

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const scrollEl = scrollRef.current;
    const parallaxEl = parallaxRef.current;
    if (!content || !scrollEl || !parallaxEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = useUIStore.getState().loadingComplete || reduceMotion ? 0.2 : 4.1;

    const ctx = gsap.context(() => {
      const els = content.querySelectorAll("[data-hero-reveal]");
      gsap.fromTo(
        els,
        { y: 48, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: reduceMotion ? 0.3 : 1,
          stagger: 0.12,
          ease: "power3.out",
          delay,
          clearProps: "filter",
        }
      );

      // Big title: letters rise from behind a mask with a slight 3D tilt
      gsap.fromTo(
        content.querySelectorAll("[data-hero-char]"),
        { yPercent: 115, rotateX: -70, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: reduceMotion ? 0.3 : 1.3,
          stagger: 0.09,
          ease: "expo.out",
          delay: delay + 0.1,
        }
      );

      if (reduceMotion) return;

      // Text drifts up and fades as the hero scrolls away
      gsap.to(scrollEl, {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
    }, content);

    // Subtle mouse parallax on the text block
    let removeMove: (() => void) | undefined;
    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
      const xTo = gsap.quickTo(parallaxEl, "x", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(parallaxEl, "y", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -18);
        yTo((e.clientY / window.innerHeight - 0.5) * -12);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMove = () => window.removeEventListener("pointermove", onMove);
    }

    return () => {
      ctx.revert();
      removeMove?.();
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <div id="home" className="relative min-h-screen">
        <SectionBackdrop imageKey="hero" alt="Kechqurun ish stoli" variant="hero" priority />

        <div
          ref={contentRef}
          className="relative z-10 flex min-h-screen flex-col justify-center px-6 pt-28 pb-24 md:px-14 lg:px-24 xl:px-32"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:gap-8 xl:gap-12">
            <div ref={scrollRef} className="max-w-4xl will-change-transform">
              <div ref={parallaxRef}>
                <p
                  data-hero-reveal
                  className="font-display text-xl font-light tracking-[0.45em] text-white/90 uppercase md:text-xl"
                >
                  ABDURASUL
                </p>

                <h1
                  aria-label={TITLE}
                  className="hero-title font-display mt-1 flex text-[clamp(4.5rem,14vw,10rem)] leading-[0.88] font-bold tracking-[-0.02em] text-[#f5f0e8] [perspective:800px]"
                >
                  {Array.from(TITLE).map((ch, i) => (
                    <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em]">
                      <span data-hero-char className="hero-title-char inline-block opacity-0 [transform-origin:50%_100%]">
                        {ch}
                      </span>
                    </span>
                  ))}
                </h1>

                <p
                  data-hero-reveal
                  className="mt-6 text-xs tracking-[0.42em] text-[#d4c4b0]/80 uppercase md:mt-8 md:text-sm"
                >
                  {TYPEWRITER_ROLES[2]}
                </p>

                <p
                  data-hero-reveal
                  className="mt-3 text-[11px] tracking-[0.2em] text-white/45 uppercase md:text-xs"
                >
                  {SITE.location} · 50+ Projects · 5+ Years
                </p>

                <div data-hero-reveal className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">
                  <Button
                    variant="ghost"
                    href="#projects"
                    className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                  >
                    Projects
                  </Button>
                  <Button
                    variant="ghost"
                    href="/shop"
                    className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                  >
                    Shop
                  </Button>
                  <Button
                    variant="ghost"
                    href="#contact"
                    className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            <HeroPortrait />
          </div>

          <div
            data-hero-reveal
            className="absolute bottom-8 left-6 flex items-center gap-5 md:bottom-10 md:left-14 lg:left-24 xl:left-32"
          >
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/45 transition-colors duration-300 hover:text-[#d4b896]"
              >
                <Icon className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.2, duration: 0.8 }}
            className="absolute right-6 bottom-8 hidden flex-col items-center gap-2 md:flex md:right-14"
          >
            <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase [writing-mode:vertical-rl]">
              Scroll
            </span>
            <ChevronDown className="bounce-arrow h-4 w-4 text-white/35" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SITE, TYPEWRITER_ROLES, SPRING } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export function HeroContent() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const chars = headlineRef.current.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: "back.out(1.4)",
        delay: 4.2,
      }
    );
  }, []);

  const title = SITE.name;
  const chars = title.split("");

  return (
    <section id="home" className="relative z-10 -mt-[100vh] flex min-h-screen flex-col items-center justify-center px-6 pt-24">
      <div className="hero-bg absolute inset-0 -z-10" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 0.8 }}
        className="text-center"
      >
        <h1
          ref={headlineRef}
          className="font-display text-[52px] font-bold tracking-[-0.02em] md:text-[96px]"
        >
          {chars.map((char, i) => (
            <span key={i} className="char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div className="mt-4 h-8 text-lg text-slate md:text-xl">
          <Typewriter
            options={{
              strings: [...TYPEWRITER_ROLES],
              autoStart: true,
              loop: true,
              delay: 80,
              deleteSpeed: 40,
            }}
          />
          <span className="cursor-blink ml-0.5 text-glow">|</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 4.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button magnetic href="#projects">View Projects</Button>
          <Button variant="secondary" magnetic href="/shop">Shop</Button>
          <Button variant="ghost" magnetic href="#contact">Contact</Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="bounce-arrow h-6 w-6 text-slate" />
      </motion.div>
    </section>
  );
}

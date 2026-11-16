"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { RobotModel } from "./robot-model";

type Line = { cmd: string; out: string };

const LINES: Record<string, Line> = {
  about: { cmd: "whoami", out: "Abdurasul — full stack developer" },
  skills: { cmd: "ls ./stack", out: "react  next.js  node  three.js  telegram" },
  achievements: { cmd: "cat achievements.log", out: "✓ 50+ loyiha · 5+ yil tajriba" },
  projects: { cmd: "open ./projects", out: "kartani bosing → to'liq case study" },
  analytics: { cmd: "npm run stats", out: "✓ ma'lumotlar real vaqtda" },
  contact: { cmd: "ssh rasul@dev", out: "ulanish tayyor — yozing, gaplashamiz" },
};

const POKES: Line[] = [
  { cmd: "rasulbot --scan", out: "✓ tizim holati: a'lo" },
  { cmd: "git status", out: "working tree clean ✓" },
  { cmd: "ping rasuldev.uz", out: "64 bytes · time=1ms" },
  { cmd: "npm test", out: "✓ 214 passed · 0 failed" },
];

/** Reveals text one character at a time, like a terminal. */
function Typed({ text, delay = 0 }: { text: string; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(id);
      }, 28);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [text, delay]);
  return <>{text.slice(0, n)}</>;
}

/** Small dev robot that rides along in the corner and reports on each section in a terminal popup. */
export function MascotCompanion() {
  const [show, setShow] = useState(false);
  const [line, setLine] = useState<Line | null>(null);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && LINES[e.target.id]) {
            setLine(LINES[e.target.id]);
            setBounce((b) => b + 1);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.keys(LINES).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // Close the popup after a while
  useEffect(() => {
    if (!line) return;
    const id = window.setTimeout(() => setLine(null), 5200);
    return () => window.clearTimeout(id);
  }, [line, bounce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          className="fixed right-2 bottom-2 z-[80] flex flex-col items-end md:right-6 md:bottom-4"
        >
          <AnimatePresence mode="wait">
            {line && (
              <motion.div
                key={line.cmd + bounce}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="term-bubble mr-4 mb-1 w-[250px] origin-bottom-right"
              >
                <div className="term-bubble-bar">
                  <span />
                  <span />
                  <span />
                  <em>rasulbot</em>
                </div>
                <div className="px-3 py-2.5 font-mono text-[12px] leading-5">
                  <div>
                    <span className="text-[#38e1ff]">❯</span> <span className="text-[#e6edf3]">{line.cmd}</span>
                  </div>
                  <div className="text-[#9fb3bf]">
                    <Typed text={line.out} delay={260} />
                    <span className="term-caret" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label="Robot yordamchi"
            onClick={() => {
              setLine(POKES[Math.floor(Math.random() * POKES.length)]);
              setBounce((b) => b + 1);
            }}
            className="h-[110px] w-[120px] md:h-[130px] md:w-[145px]"
          >
            <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.1, 5.4], fov: 32 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[3, 5, 4]} intensity={1.8} />
              <directionalLight position={[-4, 2, -3]} intensity={2} color="#38e1ff" />
              <Environment resolution={64} frames={1}>
                <Lightformer form="rect" intensity={2.5} position={[0, 4, 2]} scale={[6, 2, 1]} />
                <Lightformer form="rect" intensity={2.5} position={[-4, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 3, 1]} color="#38e1ff" />
              </Environment>
              <Suspense fallback={null}>
                <RobotModel position={[0, -0.95, 0]} scale={0.4} bounceKey={bounce} typing={false} />
              </Suspense>
            </Canvas>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MascotCompanion;

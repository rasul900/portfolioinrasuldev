"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { ToonMascot } from "./toon-mascot";

const LINES: Record<string, string> = {
  about: "Salom! Bu men haqimda 👋",
  skills: "Mana mening qurollarim ⚡",
  achievements: "Yutuqlarimga bir qarang 🏆",
  projects: "Kartani bosing — ichida case study bor!",
  analytics: "Raqamlar o'zi gapiradi 📈",
  contact: "Keling, birga zo'r narsa quramiz! 🚀",
};

const POKES = ["Hey, qitiqlamang! 😆", "Bip-bup! 🤖", "Kod yozamizmi? 💻", "Yana bir marta! ✨"];

/** Small 3D robot that rides along in the corner and comments on each section. */
export function MascotCompanion() {
  const [show, setShow] = useState(false);
  const [line, setLine] = useState<string | null>(null);
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

  // Let the bubble fade after a while
  useEffect(() => {
    if (!line) return;
    const id = window.setTimeout(() => setLine(null), 4200);
    return () => window.clearTimeout(id);
  }, [line, bounce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 160, opacity: 0, rotate: 12 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 160, opacity: 0, rotate: 12 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="fixed right-2 bottom-2 z-[80] flex flex-col items-end md:right-6 md:bottom-4"
        >
          <AnimatePresence mode="wait">
            {line && (
              <motion.div
                key={line}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 6 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="toon-bubble mr-6 mb-[-6px] max-w-[220px] origin-bottom-right px-4 py-2.5 text-sm font-semibold"
              >
                {line}
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
            className="h-[120px] w-[104px] md:h-[150px] md:w-[130px]"
          >
            <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.6, 5.2], fov: 35 }} gl={{ alpha: true, antialias: true }}>
              <ambientLight intensity={0.9} />
              <hemisphereLight args={["#ffe7c4", "#3a2c4a", 0.8]} />
              <directionalLight position={[3, 5, 4]} intensity={2.2} />
              <ToonMascot position={[0, -0.3, 0]} scale={0.95} bounceKey={bounce} waving={false} />
            </Canvas>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MascotCompanion;

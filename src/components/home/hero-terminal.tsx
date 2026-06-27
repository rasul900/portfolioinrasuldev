"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  { cmd: "$ npx create-next-app@latest rasul-dev", out: "✓ Next.js 16 ready" },
  { cmd: "$ npm run build", out: "✓ Compiled successfully" },
  { cmd: "$ git commit -m 'feat: awwwards hero'", out: "[main a3f9c2d] 12 files changed" },
  { cmd: "$ deploy --prod", out: "✓ https://rasuldev.uz live" },
  { cmd: "$ bot.sendMessage(chatId, 'New order!')", out: "✓ Message delivered" },
];

export function HeroTerminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");
  const [display, setDisplay] = useState<{ cmd: string; out?: string }[]>([]);

  useEffect(() => {
    const line = LINES[lineIdx];
    if (phase === "typing") {
      if (charIdx < line.cmd.length) {
        const t = setTimeout(() => {
          setCharIdx((c) => c + 1);
          setDisplay((prev) => {
            const next = [...prev];
            if (!next[lineIdx]) next[lineIdx] = { cmd: "" };
            next[lineIdx] = { cmd: line.cmd.slice(0, charIdx + 1) };
            return next;
          });
        }, 35 + Math.random() * 25);
        return () => clearTimeout(t);
      }
      setPhase("output");
    } else if (phase === "output") {
      const t = setTimeout(() => {
        setDisplay((prev) => {
          const next = [...prev];
          next[lineIdx] = { cmd: line.cmd, out: line.out };
          return next;
        });
        setPhase("pause");
      }, 300);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx((i) => (i + 1) % LINES.length);
        setCharIdx(0);
        setPhase("typing");
        if (lineIdx === LINES.length - 1) setDisplay([]);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, phase]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 5, duration: 0.8 }}
      className="premium-card hidden w-full max-w-md overflow-hidden rounded-2xl border border-azure/20 lg:block"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-[10px] text-slate">rasul@dev ~ zsh</span>
      </div>
      <div className="h-44 overflow-hidden p-4 font-mono text-xs leading-relaxed">
        {display.map((d, i) => (
          <div key={i} className="mb-2">
            <p className="text-glow">{d.cmd}{i === lineIdx && phase === "typing" && <span className="cursor-blink">▋</span>}</p>
            {d.out && <p className="text-green-400/80">{d.out}</p>}
          </div>
        ))}
        {display.length === 0 && (
          <p className="text-glow">
            {LINES[0].cmd.slice(0, charIdx)}
            <span className="cursor-blink">▋</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

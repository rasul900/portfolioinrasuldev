"use client";

import { useEffect, useRef } from "react";

const SNIPPETS = [
  "import { useState } from 'react'",
  "const app = express()",
  "await mongoose.connect()",
  "export default function Page()",
  "npm run build",
  "git push origin main",
  "socket.emit('update')",
  "stripe.paymentIntents.create()",
  "ScrollTrigger.create({",
  "useFrame(({ clock }) => {",
  "interface User { id: string }",
  "redis.set('cache', data)",
  "bot.on('message', handler)",
  "return NextResponse.json()",
  "const { data } = await fetch()",
  "tailwind.config.ts",
  "type Props = { children: ReactNode }",
  "cloudinary.uploader.upload()",
  "zustand.create(set => ({",
  "framer-motion animate",
  "three.Scene()",
  "process.env.MONGODB_URI",
  "auth.middleware()",
  "gsap.to(target, { y: 0 })",
  "docker compose up -d",
  "SELECT * FROM orders",
  "WebSocket.OPEN",
  "prisma.user.findMany()",
  "lenis.on('scroll')",
];

interface Column {
  x: number;
  y: number;
  speed: number;
  snippet: string;
  chars: number;
  opacity: number;
}

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: Column[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colWidth = 22;
      const count = Math.ceil(window.innerWidth / colWidth) + 2;
      columns = Array.from({ length: count }, (_, i) => ({
        x: i * colWidth,
        y: Math.random() * -window.innerHeight,
        speed: 0.6 + Math.random() * 1.4,
        snippet: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        chars: 0,
        opacity: 0.15 + Math.random() * 0.45,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const fontSize = 13;
    const lineHeight = 18;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = "rgba(5, 8, 22, 0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

      columns.forEach((col) => {
        const snippet = col.snippet;
        const visibleLen = Math.min(col.chars, snippet.length);

        for (let i = 0; i < visibleLen; i++) {
          const charY = col.y + i * lineHeight;
          if (charY < -lineHeight || charY > h + lineHeight) continue;

          const isHead = i === visibleLen - 1;
          const fade = 1 - i / (visibleLen + 4);

          if (isHead) {
            ctx.fillStyle = `rgba(147, 197, 253, ${col.opacity + 0.35})`;
            ctx.shadowColor = "rgba(59, 130, 246, 0.8)";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = `rgba(37, 99, 235, ${col.opacity * fade})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(snippet[i], col.x, charY);
        }
        ctx.shadowBlur = 0;

        col.y += col.speed;
        if (col.chars < snippet.length) col.chars += 0.15;

        if (col.y - snippet.length * lineHeight > h) {
          col.y = -snippet.length * lineHeight - Math.random() * 200;
          col.snippet = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
          col.chars = 0;
          col.speed = 0.6 + Math.random() * 1.4;
          col.opacity = 0.15 + Math.random() * 0.45;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

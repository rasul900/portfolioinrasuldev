"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

type ScreenType = "telegram" | "instagram" | "github" | "portfolio";

function drawScreen(ctx: CanvasRenderingContext2D, type: ScreenType, w: number, h: number, flicker: number) {
  ctx.fillStyle = "#050816";
  ctx.fillRect(0, 0, w, h);

  const alpha = 1 - flicker * 0.8;
  ctx.globalAlpha = alpha;

  switch (type) {
    case "telegram":
      ctx.fillStyle = "#2CA5E0";
      ctx.fillRect(0, 0, w, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("RASUL DEV Channel", 12, 26);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? "#0F172A" : "#1e293b";
        ctx.fillRect(8, 50 + i * 28, w - 16, 24);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.fillText(`Post #${i + 1} — Bot development tips...`, 16, 66 + i * 28);
      }
      break;
    case "instagram":
      ctx.fillStyle = "#E1306C";
      ctx.fillRect(0, 0, w, 30);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("@rasuldev", 12, 20);
      const cols = 3;
      const size = (w - 24) / cols;
      for (let i = 0; i < 9; i++) {
        const x = 8 + (i % cols) * size;
        const y = 38 + Math.floor(i / cols) * size;
        const hue = 210 + i * 8;
        ctx.fillStyle = `hsl(${hue}, 60%, 35%)`;
        ctx.fillRect(x, y, size - 4, size - 4);
      }
      break;
    case "github":
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#238636";
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 20; col++) {
          const seed = (row * 20 + col) % 7;
          if (seed > 2) {
            const intensity = ((row * 20 + col) % 5) / 5;
            ctx.fillStyle = `rgba(35, 134, 54, ${0.2 + intensity * 0.8})`;
            ctx.fillRect(8 + col * 14, 20 + row * 14, 12, 12);
          }
        }
      }
      ctx.fillStyle = "#fff";
      ctx.font = "11px monospace";
      ctx.fillText("rasuldev — 1,234 contributions", 8, h - 10);
      break;
    case "portfolio":
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4; i++) {
        const pw = (w - 24) / 2;
        const ph = (h - 40) / 2;
        ctx.fillStyle = `hsl(${220 + i * 15}, 70%, ${25 + i * 5}%)`;
        ctx.fillRect(8 + (i % 2) * (pw + 4), 8 + Math.floor(i / 2) * (ph + 4), pw, ph);
        ctx.fillStyle = "#93c5fd";
        ctx.font = "10px sans-serif";
        ctx.fillText(`Project ${i + 1}`, 14 + (i % 2) * (pw + 4), 22 + Math.floor(i / 2) * (ph + 4));
      }
      break;
  }
  ctx.globalAlpha = 1;

  // CRT scanlines
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
}

export function useScreenTexture(progress: React.MutableRefObject<number>) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastContent = useRef<ScreenType>("telegram");
  const flickerRef = useRef(0);
  const prevProgress = useRef(0);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 288;
    canvasRef.current = canvas;
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    textureRef.current = tex;
    drawScreen(canvas.getContext("2d")!, "telegram", 512, 288, 0);
    return tex;
  }, []);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      const p = progress.current;
      const canvas = canvasRef.current;
      const tex = textureRef.current;
      if (!canvas || !tex) {
        raf = requestAnimationFrame(animate);
        return;
      }

      let type: ScreenType = "telegram";
      if (p < 0.3) type = "telegram";
      else if (p < 0.55) type = "instagram";
      else if (p < 0.75) type = "github";
      else type = "portfolio";

      const thresholds = [0.3, 0.55, 0.75];
      for (const t of thresholds) {
        if (Math.abs(p - t) < 0.02 && Math.abs(p - prevProgress.current) > 0.001) {
          flickerRef.current = 1;
        }
      }
      prevProgress.current = p;
      flickerRef.current *= 0.85;

      if (type !== lastContent.current || flickerRef.current > 0.05) {
        const ctx = canvas.getContext("2d")!;
        drawScreen(ctx, type, canvas.width, canvas.height, flickerRef.current);
        tex.needsUpdate = true;
        lastContent.current = type;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return texture;
}

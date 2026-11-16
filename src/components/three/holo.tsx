"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { robotSignal } from "./robot-model";

const CYAN = "#38e1ff";
const GOLD = "#e3b15f";
const FONT = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const CODE = [
  "import { Developer } from '@rasul/core';",
  "",
  "const dev = new Developer('Abdurasul');",
  "dev.stack = ['Next.js', 'Node', 'Three.js'];",
  "",
  "export async function ship(idea: Idea) {",
  "  const app = await dev.build(idea, {",
  "    quality: 'premium',",
  "    tests: true,",
  "  });",
  "  return deploy(app, 'rasuldev.uz');",
  "}",
  "",
  "bot.on('message', (ctx) => {",
  "  ctx.reply('Salom! Qanday yordam kerak?');",
  "});",
  "",
  "// TODO: make the internet nicer",
];

function drawCodeLine(ctx: CanvasRenderingContext2D, line: string, x: number, y: number) {
  if (line.trim().startsWith("//")) {
    ctx.fillStyle = "#5f7a86";
    ctx.fillText(line, x, y);
    return;
  }
  // Tokenise into strings / keywords / rest, drawing each with its colour
  const tokens: { text: string; color: string }[] = [];
  const re = /('[^']*')|(\b(?:import|from|const|export|async|function|await|return|new|true|false)\b)|([A-Z][A-Za-z]+)|([^'A-Za-z]+|[a-z_][A-Za-z_]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) tokens.push({ text: m[1], color: "#ffd27a" });
    else if (m[2]) tokens.push({ text: m[2], color: "#c792ea" });
    else if (m[3]) tokens.push({ text: m[3], color: CYAN });
    else tokens.push({ text: m[0], color: "#d7e3ea" });
  }
  let cx = x;
  for (const tk of tokens) {
    ctx.fillStyle = tk.color;
    ctx.fillText(tk.text, cx, y);
    cx += ctx.measureText(tk.text).width;
  }
}

type PanelKind = "code" | "terminal" | "metrics";

function frame(ctx: CanvasRenderingContext2D, w: number, h: number, title: string, accent: string) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(8, 16, 24, 0.72)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(56, 225, 255, 0.07)";
  ctx.fillRect(0, 0, w, 34);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.globalAlpha = 1;
  // corner brackets
  ctx.lineWidth = 4;
  const c = 18;
  [
    [0, 0, 1, 1],
    [w, 0, -1, 1],
    [0, h, 1, -1],
    [w, h, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * 2, y + sy * c);
    ctx.lineTo(x + sx * 2, y + sy * 2);
    ctx.lineTo(x + sx * c, y + sy * 2);
    ctx.stroke();
  });
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(20 + i * 18, 17, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#8fb4c2";
  ctx.font = `500 15px ${FONT}`;
  ctx.fillText(title, 82, 22);
}

function scanlines(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 36; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  const sy = 36 + (((t * 60) % (h - 36)) | 0);
  const g = ctx.createLinearGradient(0, sy - 30, 0, sy);
  g.addColorStop(0, "rgba(56,225,255,0)");
  g.addColorStop(1, "rgba(56,225,255,0.10)");
  ctx.fillStyle = g;
  ctx.fillRect(0, sy - 30, w, 30);
}

const TERMINAL = [
  "$ npm run build",
  "  ▲ Next.js 16 — compiling…",
  "  ✓ Compiled successfully in 1.4s",
  "  ✓ 158 static pages generated",
  "$ npm test",
  "  ✓ 214 passed · 0 failed",
  "$ git push origin main",
  "  → deploying to rasuldev.uz",
  "  ✓ Live in 38s",
];

/** A floating holographic screen rendered from a live 2D canvas. */
export function HoloPanel({
  kind,
  width,
  height,
  title,
  ...props
}: { kind: PanelKind; width: number; height: number; title: string } & Omit<ThreeElements["group"], "children">) {
  const pxW = 640;
  const pxH = Math.round((pxW * height) / width);
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = pxW;
    c.height = pxH;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas: c, texture: tex };
  }, [pxH]);
  useEffect(() => () => texture.dispose(), [texture]);

  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const acc = useRef(0);
  const seed = width * 7.3 + height * 3.1;
  const bars = useRef<number[]>(Array.from({ length: 14 }, (_, i) => 0.45 + Math.sin(i * 1.7) * 0.25));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = (props.position as [number, number, number])[1] + Math.sin(t * 0.9 + seed) * 0.05;
    }
    acc.current += delta;
    if (acc.current < 1 / 12) return; // redraw ~12×/s
    acc.current = 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = pxW;
    const h = pxH;
    const sinceAction = t - robotSignal.at;
    const scanning = robotSignal.action === "scan" && sinceAction >= 0 && sinceAction < 2.4;
    const deploying = robotSignal.action === "deploy" && sinceAction >= 0 && sinceAction < 3.2;
    const accent = deploying ? GOLD : CYAN;

    frame(ctx, w, h, title, accent);
    ctx.font = `400 17px ${FONT}`;
    ctx.textBaseline = "alphabetic";

    if (kind === "code") {
      const lineH = 25;
      const visible = Math.floor((h - 50) / lineH);
      const typed = robotSignal.typing ? t * 9 : 0;
      const start = Math.floor((t * 0.6) % CODE.length);
      for (let i = 0; i < visible; i++) {
        const idx = (start + i) % CODE.length;
        let line = CODE[idx];
        ctx.fillStyle = "#3e5a66";
        ctx.fillText(String(idx + 1).padStart(2, " "), 14, 60 + i * lineH);
        if (i === visible - 1) {
          const n = Math.floor(typed % (line.length + 8));
          line = line.slice(0, n);
        }
        drawCodeLine(ctx, line, 52, 60 + i * lineH);
        if (i === visible - 1 && Math.floor(t * 2) % 2 === 0) {
          const x = 52 + ctx.measureText(line).width + 2;
          ctx.fillStyle = CYAN;
          ctx.fillRect(x, 60 + i * lineH - 15, 9, 18);
        }
      }
    } else if (kind === "terminal") {
      const lineH = 26;
      const rows = Math.floor((h - 50) / lineH);
      const shown = deploying
        ? ["$ rasulbot deploy --prod", "  → building…", "  → uploading assets", "  ✓ DEPLOYED · 200 OK"].slice(0, 1 + Math.floor(sinceAction * 2.2))
        : TERMINAL.slice(0, (Math.floor(t * 0.8) % (TERMINAL.length + 3)) + 1).slice(-rows);
      shown.forEach((ln, i) => {
        ctx.fillStyle = ln.startsWith("$") ? "#d7e3ea" : ln.includes("✓") ? (deploying ? GOLD : "#5ef2a0") : "#8fb4c2";
        ctx.fillText(ln, 18, 62 + i * lineH);
      });
      if (Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = accent;
        ctx.fillRect(18, 62 + shown.length * lineH - 15, 10, 18);
      }
    } else {
      // metrics: bar chart + uptime line
      const b = bars.current;
      if (Math.random() < 0.5) {
        b.shift();
        b.push(0.25 + Math.random() * 0.7 + (deploying ? 0.2 : 0));
      }
      const bw = (w - 40) / b.length;
      b.forEach((v, i) => {
        const bh = Math.min(v, 1) * (h - 90);
        ctx.fillStyle = i === b.length - 1 ? accent : "rgba(56,225,255,0.45)";
        ctx.fillRect(20 + i * bw + 3, h - 20 - bh, bw - 6, bh);
      });
      ctx.fillStyle = "#d7e3ea";
      ctx.font = `600 18px ${FONT}`;
      ctx.fillText(`CPU ${Math.round(28 + Math.sin(t) * 9)}%`, 18, 60);
      ctx.fillStyle = "#5ef2a0";
      ctx.fillText("uptime 99.98%", w - 175, 60);
    }

    if (scanning) {
      const y = 36 + ((sinceAction / 2.4) * (h - 36));
      ctx.fillStyle = "rgba(56,225,255,0.28)";
      ctx.fillRect(0, y - 3, w, 6);
      ctx.fillStyle = CYAN;
      ctx.font = `700 16px ${FONT}`;
      ctx.fillText("SCANNING…", w - 120, 22);
    } else if (deploying) {
      ctx.fillStyle = GOLD;
      ctx.font = `700 16px ${FONT}`;
      ctx.fillText("✓ DEPLOYED", w - 128, 22);
    }
    scanlines(ctx, w, h, t);
    if (screen.current?.map) screen.current.map.needsUpdate = true;
  });

  return (
    <group ref={group} {...props}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={screen} map={texture} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* soft glow behind the screen */}
      <mesh position={[0, 0, -0.02]} scale={[1.06, 1.1, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.05} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** Holographic keyboard whose keys light up as the robot types. */
export function HoloKeyboard(props: Omit<ThreeElements["group"], "children">) {
  const cols = 12;
  const rows = 4;
  const count = cols * rows;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const heat = useRef(new Float32Array(count));
  const lastTap = useRef(-100);
  const color = useMemo(() => new THREE.Color(), []);
  const base = useMemo(() => new THREE.Color("#0f3a48"), []);
  const hot = useMemo(() => new THREE.Color(CYAN), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        o.position.set((c - (cols - 1) / 2) * 0.13 + (r % 2) * 0.03, 0, (r - (rows - 1) / 2) * 0.13);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
        m.setColorAt(i, base);
      }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [base, count]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (robotSignal.lastTap !== lastTap.current) {
      lastTap.current = robotSignal.lastTap;
      heat.current[Math.floor(Math.random() * count)] = 1;
    }
    for (let i = 0; i < count; i++) {
      heat.current[i] = Math.max(0, heat.current[i] - delta * 3);
      color.copy(base).lerp(hot, heat.current[i]);
      m.setColorAt(i, color);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group {...props}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <planeGeometry args={[1.7, 0.65]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.07} toneMapped={false} depthWrite={false} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.1, 0.012, 0.1]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

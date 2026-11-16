"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useUIStore } from "@/store/ui";
import { RobotModel } from "./robot-model";
import { HoloKeyboard, HoloPanel } from "./holo";

const CYAN = "#38e1ff";
const GOLD = "#e3b15f";

/** Floating hexagonal workstation the robot stands on. */
function Platform() {
  const ring = useRef<THREE.Group>(null);
  const edge = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state, d) => {
    if (ring.current) ring.current.rotation.y += d * 0.15;
    if (edge.current) edge.current.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });
  return (
    <group>
      {/* deck */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[2.2, 2.05, 0.24, 6]} />
        <meshStandardMaterial color="#15161d" metalness={0.85} roughness={0.32} />
      </mesh>
      {/* inset top plate */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[1.95, 1.95, 0.02, 6]} />
        <meshStandardMaterial color="#1d1f28" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* glowing hex edge */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[2.18, 0.018, 6, 6]} />
        <meshBasicMaterial ref={edge} color={CYAN} transparent toneMapped={false} />
      </mesh>
      {/* underside */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.6, 2.05, 0.62, 6]} />
        <meshStandardMaterial color="#101118" metalness={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 24]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
      {/* orbiting data ring */}
      <group ref={ring}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <torusGeometry args={[2.55, 0.008, 4, 96]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.55} toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 2.55, -0.2, Math.sin((i * Math.PI * 2) / 3) * 2.55]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Scene() {
  const world = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const loadingComplete = useUIStore((s) => s.loadingComplete);
  const appearAt = useRef<number | null>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const wide = viewport.aspect > 1.1;
  const baseX = wide ? Math.min(viewport.width * 0.19, 3) : 0;
  const baseScale = wide ? 0.82 : Math.min(0.8, viewport.width / 7.4);

  useFrame((state, d) => {
    const g = world.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if ((loadingComplete || reduceMotion.current) && appearAt.current === null) appearAt.current = t;

    // Smooth power-on rise once the loader is gone
    let k = 0;
    if (appearAt.current !== null) k = 1 - Math.pow(1 - Math.min((t - appearAt.current) / 1.4, 1), 3);
    g.scale.setScalar(Math.max(0.85 + k * 0.15, 0.0001) * baseScale * (k > 0 ? 1 : 0.0001));

    const scroll = window.scrollY / window.innerHeight;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.28 + scroll * 0.6 + Math.sin(t * 0.2) * 0.04, 4, d);
    g.position.set(baseX, -0.75 + (1 - k) * -0.6 + Math.sin(t * 0.7) * 0.04 + scroll * 1.2, 0);
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 7, 5]} intensity={1.6} color="#fff1dc" />
      <directionalLight position={[-5, 3, -4]} intensity={2.2} color={CYAN} />
      <pointLight position={[0, 1.6, 1.6]} intensity={6} distance={5} color={CYAN} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 2]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 2.5, 1]} color={CYAN} />
        <Lightformer form="rect" intensity={0.9} position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 2, 1]} color={GOLD} />
        <Lightformer form="ring" intensity={1.5} position={[0, 2, -5]} scale={3} color="#ffffff" />
      </Environment>

      <group ref={world} scale={0.0001}>
        <Platform />
        <Suspense fallback={null}>
          <RobotModel position={[0, 0.02, -0.15]} scale={0.48} broadcast />
        </Suspense>
        <HoloKeyboard position={[0, 0.03, 1.15]} />
        <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={4.5} blur={2.2} far={2} color="#000000" />

        <HoloPanel kind="code" title="ship.ts — rasul-dev" width={2.1} height={1.35} position={[-2.35, 2.05, -0.7]} rotation={[0, 0.5, 0]} />
        <HoloPanel kind="terminal" title="zsh — deploy" width={1.75} height={1.05} position={[2.3, 1.75, -0.55]} rotation={[0, -0.5, 0]} />
        <HoloPanel kind="metrics" title="monitor" width={1.25} height={0.6} position={[0.55, 3.55, -1.3]} rotation={[0, -0.1, 0]} />

        <Sparkles count={36} scale={[7, 4.5, 3.5]} position={[0, 2, 0]} size={1.8} speed={0.25} color={CYAN} opacity={0.6} />
      </group>
    </>
  );
}

export function HeroTechScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering while the hero is off-screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.4, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default HeroTechScene;

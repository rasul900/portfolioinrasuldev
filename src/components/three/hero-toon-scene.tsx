"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useUIStore } from "@/store/ui";
import { RobotModel } from "./robot-model";
import { Ink, Toon } from "./toon-kit";

function Cloud({ position, scale = 1, speed = 0.3 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const startX = position[0];
  useFrame((state) => {
    if (ref.current) ref.current.position.x = startX + Math.sin(state.clock.elapsedTime * speed) * 0.6;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [0, 0, 0, 0.5],
        [0.5, 0.1, 0, 0.4],
        [-0.5, 0.05, 0, 0.38],
        [0.2, 0.32, 0, 0.36],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 20, 20]} />
          <Toon color="#fff8ee" />
          <Ink thickness={0.03} />
        </mesh>
      ))}
    </group>
  );
}

function CodeCube({ position, color, size = 0.42 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.6;
      ref.current.rotation.y += d * 0.8;
    }
  });
  return (
    <Float speed={2.4} floatIntensity={1.4} rotationIntensity={0.4}>
      <RoundedBox ref={ref} args={[size, size, size]} radius={size * 0.18} position={position}>
        <Toon color={color} />
        <Ink thickness={0.025} />
      </RoundedBox>
    </Float>
  );
}

function Planet({ position }: { position: [number, number, number] }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) ring.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15 + 0.35;
  });
  return (
    <Float speed={1.2} floatIntensity={0.8}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <Toon color="#7b9cc4" />
          <Ink />
        </mesh>
        <mesh ref={ring} rotation={[1.2, 0, 0.35]}>
          <torusGeometry args={[0.85, 0.06, 12, 48]} />
          <Toon color="#e8b96a" />
          <Ink thickness={0.02} />
        </mesh>
      </group>
    </Float>
  );
}

function Laptop(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (screen.current) {
      const k = 0.75 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      screen.current.color.setRGB(0.42 * k, 0.75 * k, 1 * k);
    }
  });
  return (
    <group {...props}>
      <RoundedBox args={[0.95, 0.07, 0.62]} radius={0.03}>
        <Toon color="#3b3550" />
        <Ink thickness={0.02} />
      </RoundedBox>
      <group position={[0, 0.03, -0.3]} rotation={[-0.35, 0, 0]}>
        <RoundedBox args={[0.95, 0.62, 0.05]} radius={0.03} position={[0, 0.31, 0]}>
          <Toon color="#3b3550" />
          <Ink thickness={0.02} />
        </RoundedBox>
        <mesh position={[0, 0.31, 0.03]}>
          <planeGeometry args={[0.82, 0.5]} />
          <meshBasicMaterial ref={screen} color="#6bbfff" toneMapped={false} />
        </mesh>
        {/* "code" lines */}
        {[0.16, 0.06, -0.04, -0.14].map((y, i) => (
          <mesh key={y} position={[-0.18 + (i % 2) * 0.06, 0.31 + y, 0.035]}>
            <planeGeometry args={[0.36 - i * 0.05, 0.035]} />
            <meshBasicMaterial color={i % 2 ? "#ffd27a" : "#1d1b2f"} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  const crown = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (crown.current) crown.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.7, 10]} />
        <Toon color="#8a5a3c" />
        <Ink thickness={0.02} />
      </mesh>
      <group ref={crown} position={[0, 0.7, 0]}>
        {[
          [0, 0.2, 0, 0.42],
          [0.28, 0, 0.05, 0.3],
          [-0.28, 0.02, 0, 0.32],
          [0, 0.5, 0, 0.28],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 18, 18]} />
            <Toon color="#7fc46b" />
            <Ink thickness={0.025} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Island() {
  return (
    <group>
      {/* grass cap */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.15, 2.1, 0.22, 40]} />
        <Toon color="#8fcf6f" />
        <Ink />
      </mesh>
      {/* soil */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[2.05, 1.95, 0.22, 40]} />
        <Toon color="#c98f5a" />
      </mesh>
      {/* rock underside */}
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.95, 1.7, 9]} />
        <Toon color="#7a5a48" />
        <Ink />
      </mesh>
      {/* little gems in the rock */}
      {[
        [0.7, -0.6, 1.1],
        [-0.9, -0.85, 0.7],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.4, i, 0.3]}>
          <octahedronGeometry args={[0.16]} />
          <Toon color={i ? "#7ff3ff" : "#ffcf6b"} emissive={i ? "#3fb7c9" : "#c98f2a"} emissiveIntensity={0.6} />
          <Ink thickness={0.02} />
        </mesh>
      ))}
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

  // Narrow screens: centre the scene; wide screens: sit on the right
  const wide = viewport.aspect > 1.1;
  const baseX = wide ? Math.min(viewport.width * 0.19, 3) : 0;
  const baseScale = wide ? 0.86 : Math.min(0.92, viewport.width / 6.6);

  useFrame((state, d) => {
    const g = world.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if ((loadingComplete || reduceMotion.current) && appearAt.current === null) appearAt.current = t;

    // Elastic pop-in once the loader is gone
    let s = 0;
    if (appearAt.current !== null) {
      const p = Math.min((t - appearAt.current) / 1.1, 1);
      s = p === 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 3.2);
    }
    g.scale.setScalar(Math.max(s, 0.0001) * baseScale);

    // Spin a little with scroll, bob gently
    const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + scroll * 1.2 + Math.sin(t * 0.25) * 0.08, 4, d);
    g.position.set(baseX, -0.6 + Math.sin(t * 0.8) * 0.08 + scroll * 1.5, 0);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#ffe7c4", "#3a2c4a", 0.8]} />
      <directionalLight position={[4, 7, 5]} intensity={2.4} color="#fff1dc" />

      <group ref={world} scale={0.0001}>
        <Island />
        <Suspense fallback={null}>
          <RobotModel position={[0, 0.16, 0]} scale={0.48} />
        </Suspense>
        <Laptop position={[1.5, 0.24, 1.15]} rotation={[0, -0.7, 0]} />
        <Tree position={[-1.55, 0.15, -0.95]} />
        <ContactShadows position={[0, 0.17, 0]} opacity={0.45} scale={4.5} blur={2.4} far={2} color="#2b1c12" />

        <Planet position={[-2.6, 2.9, -1.6]} />
        <Cloud position={[2.2, 3.1, -1.2]} scale={0.8} speed={0.35} />
        <Cloud position={[-2.9, 0.9, -0.6]} scale={0.6} speed={0.25} />
        <CodeCube position={[2.5, 1.6, 0.4]} color="#ffcf6b" />
        <CodeCube position={[-2.2, 2.1, 0.8]} color="#ff8fab" size={0.32} />
        <CodeCube position={[1.6, 3.2, 0.6]} color="#7ff3ff" size={0.28} />
        <Sparkles count={40} scale={[7, 5, 3]} position={[0, 2, 0]} size={3} speed={0.4} color="#ffe2a8" />
      </group>
    </>
  );
}

export function HeroToonScene() {
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
        camera={{ position: [0, 1.2, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default HeroToonScene;

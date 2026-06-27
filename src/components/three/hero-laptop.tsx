"use client";

import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Stars } from "@react-three/drei";
import * as THREE from "three";
import { LaptopModel } from "./laptop-model";

function CameraRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { camera, mouse } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(0, 0.6, p);
    cam.position.y = THREE.MathUtils.lerp(1.6, 2.2, p);
    cam.position.z = THREE.MathUtils.lerp(7.2, 5.5, p);
    cam.lookAt(0.5 + p * 1.5, 0.2, 0);

    cam.rotation.y += (mouse.x * 0.08 - cam.rotation.y) * 0.03;
    cam.rotation.x += (-mouse.y * 0.05 - cam.rotation.x) * 0.03;
  });

  return null;
}

function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 14, 32]} />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffffff"
      />
      <spotLight position={[-5, 6, 2]} intensity={3} angle={0.4} penumbra={0.5} color="#2563EB" />
      <spotLight position={[4, 2, -3]} intensity={1.2} color="#3B82F6" />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#93c5fd" />

      <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={0.4} />

      <Suspense fallback={null}>
        <LaptopModel scrollProgress={scrollProgress} />
      </Suspense>

      <ContactShadows
        position={[0, -0.12, 0]}
        opacity={0.55}
        scale={14}
        blur={2.8}
        far={5}
        color="#000810"
      />

      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}

export function HeroCanvas({
  scrollProgress,
  className,
}: {
  scrollProgress: React.MutableRefObject<number>;
  className?: string;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.6, 7.2], fov: 42, near: 0.1, far: 100 }}
      className={className}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  );
}

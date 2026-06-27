"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Floating404() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2}>
      <group ref={ref}>
        <mesh>
          <boxGeometry args={[4, 1.5, 0.3]} />
          <meshStandardMaterial color="#2563EB" emissive="#3B82F6" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export function NotFound3D() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#050816"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#3B82F6" />
        <Floating404 />
      </Canvas>
    </div>
  );
}

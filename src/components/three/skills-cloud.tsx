"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/data/skills";

function NebulaParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#c9a87c" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function SkillTag({
  name,
  color,
  position,
}: {
  name: string;
  color: string;
  position: [number, number, number];
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <Text
        position={position}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#050816"
      >
        {name}
      </Text>
    </Float>
  );
}

function Cloud() {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const phi = Math.PI * (3 - Math.sqrt(5));
    return skills.map((_, i) => {
      const y = 1 - (i / (skills.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      return [
        Math.cos(theta) * radius * 2.5,
        y * 2.5,
        Math.sin(theta) * radius * 2.5,
      ] as [number, number, number];
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#1a1816" transparent opacity={0.12} wireframe />
      </mesh>
      {skills.map((skill, i) => (
        <SkillTag key={skill.name} name={skill.name} color={skill.color} position={positions[i]} />
      ))}
    </group>
  );
}

export function SkillsCloud3D() {
  return (
    <div className="h-72 w-full overflow-hidden md:h-80">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <color attach="background" args={["#0a0908"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.9} color="#c9a87c" />
        <pointLight position={[-4, -2, 3]} intensity={0.5} color="#6b8cae" />
        <NebulaParticles />
        <Cloud />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScreenTexture } from "./screen-texture";

const BASE_W = 3.8;
const BASE_D = 2.55;
const BASE_H = 0.16;
const LID_H = 1.75;
const LID_D = 0.1;
const HINGE_Z = -BASE_D / 2 + 0.05;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function LaptopModel({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const rootRef = useRef<THREE.Group>(null);
  const lidPivotRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const screenTexture = useScreenTexture(scrollProgress);

  const aluminum = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#1c1c28",
        metalness: 0.92,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.8,
      }),
    []
  );

  const aluminumLight = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2a2a3d",
        metalness: 0.88,
        roughness: 0.22,
        clearcoat: 0.8,
      }),
    []
  );

  const keyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0c0c14",
        metalness: 0.4,
        roughness: 0.55,
        emissive: new THREE.Color("#2563EB"),
        emissiveIntensity: 0,
      }),
    []
  );

  const trackpadMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#14141e",
        metalness: 0.6,
        roughness: 0.35,
        clearcoat: 0.5,
      }),
    []
  );

  useFrame(() => {
    const p = scrollProgress.current;
    const openT = smoothstep(0.05, 0.42, p);
    const moveT = easeOutCubic(smoothstep(0.15, 1, p));

    if (rootRef.current) {
      rootRef.current.position.x = THREE.MathUtils.lerp(-0.8, 3.2, moveT);
      rootRef.current.position.y = THREE.MathUtils.lerp(-0.15, 0.05, moveT);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(0.45, -0.55, moveT);
    }

    if (lidPivotRef.current) {
      // Yopiq: qopqoq klaviatura ustida (-PI/2 ga yaqin)
      // Ochiq: foydalanuvchiga qarab (~-0.32 rad)
      const closed = -Math.PI * 0.5 + 0.04;
      const opened = -0.32;
      lidPivotRef.current.rotation.x = THREE.MathUtils.lerp(closed, opened, easeOutCubic(openT));
    }

    if (screenMatRef.current) {
      screenMatRef.current.opacity = Math.min(1, openT * 1.4);
    }

    if (keyMat) {
      keyMat.emissiveIntensity = openT * 1.8;
    }
  });

  const keyRows = [
    { count: 14, z: -0.72, w: 0.19 },
    { count: 14, z: -0.5, w: 0.19 },
    { count: 14, z: -0.28, w: 0.19 },
    { count: 13, z: -0.06, w: 0.19 },
  ];

  return (
    <group ref={rootRef} scale={1.15} position={[0, 0, 0]}>
      {/* === BASE === */}
      <mesh castShadow receiveShadow material={aluminum} position={[0, 0, 0]}>
        <boxGeometry args={[BASE_W, BASE_H, BASE_D]} />
      </mesh>

      {/* Chamfer lip */}
      <mesh position={[0, BASE_H / 2 + 0.004, BASE_D / 2 - 0.04]} material={aluminumLight}>
        <boxGeometry args={[BASE_W - 0.1, 0.008, 0.06]} />
      </mesh>

      {/* Keyboard well */}
      <mesh position={[0, BASE_H / 2 + 0.006, -0.1]} material={trackpadMat}>
        <boxGeometry args={[BASE_W - 0.35, 0.012, BASE_D - 0.55]} />
      </mesh>

      {/* Keys */}
      {keyRows.map((row, ri) => {
        const startX = (-(row.count - 1) * row.w) / 2;
        return Array.from({ length: row.count }).map((_, ki) => (
          <mesh
            key={`${ri}-${ki}`}
            position={[startX + ki * row.w, BASE_H / 2 + 0.018, row.z]}
            material={keyMat}
          >
            <boxGeometry args={[row.w - 0.03, 0.022, 0.14]} />
          </mesh>
        ));
      })}

      {/* Spacebar */}
      <mesh position={[0, BASE_H / 2 + 0.018, 0.14]} material={keyMat}>
        <boxGeometry args={[1.8, 0.022, 0.14]} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, BASE_H / 2 + 0.012, 0.62]} material={trackpadMat}>
        <boxGeometry args={[1.25, 0.008, 0.82]} />
      </mesh>

      {/* Rubber feet */}
      {[
        [-1.5, -0.95],
        [1.5, -0.95],
        [-1.5, 0.95],
        [1.5, 0.95],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -BASE_H / 2 - 0.01, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}

      {/* Side ports */}
      <mesh position={[BASE_W / 2 - 0.02, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.06, 0.18]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
      <mesh position={[BASE_W / 2 - 0.02, 0, 0.05]}>
        <boxGeometry args={[0.04, 0.05, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.8} />
      </mesh>

      {/* === HINGE BARRELS === */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, BASE_H / 2, HINGE_Z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.35, 16]} />
          <meshStandardMaterial color="#2a2a35" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* === LID (hinge pivot) === */}
      <group ref={lidPivotRef} position={[0, BASE_H / 2, HINGE_Z]}>
        <group position={[0, LID_H / 2, 0]}>
          {/* Lid back panel */}
          <mesh castShadow material={aluminum} position={[0, 0, -LID_D / 2]}>
            <boxGeometry args={[BASE_W, LID_H, LID_D]} />
          </mesh>

          {/* Lid inner bezel */}
          <mesh position={[0, 0, LID_D / 2 - 0.01]}>
            <boxGeometry args={[BASE_W - 0.08, LID_H - 0.08, 0.02]} />
            <meshStandardMaterial color="#0a0a0f" />
          </mesh>

          {/* Screen */}
          <mesh position={[0, 0, LID_D / 2 + 0.005]}>
            <planeGeometry args={[BASE_W - 0.28, LID_H - 0.28]} />
            <meshBasicMaterial ref={screenMatRef} map={screenTexture} transparent opacity={0} toneMapped={false} />
          </mesh>

          {/* Webcam */}
          <mesh position={[0, LID_H / 2 - 0.12, LID_D / 2 + 0.012]}>
            <circleGeometry args={[0.025, 16]} />
            <meshStandardMaterial color="#111" emissive="#1a3a6a" emissiveIntensity={0.3} />
          </mesh>

          {/* Logo */}
          <mesh position={[0, -LID_H / 2 + 0.35, -LID_D / 2 - 0.008]} rotation={[0, Math.PI, 0]}>
            <ringGeometry args={[0.08, 0.11, 32]} />
            <meshStandardMaterial color="#2563EB" emissive="#3B82F6" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

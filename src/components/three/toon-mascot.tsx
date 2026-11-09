"use client";

import { useEffect, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Ink, Toon, windowPointer } from "./toon-kit";

const CREAM = "#f5efe4";
const GOLD = "#d9a95b";
const SCREEN = "#1d1b2f";
const GLOW = "#7ff3ff";
const BLUSH = "#ff8fab";
const INK_SOFT = "#3a3128";

type MascotProps = ThreeElements["group"] & {
  /** Change this number to make the mascot hop (e.g. on a new speech bubble). */
  bounceKey?: number;
  /** Keep waving the right arm. */
  waving?: boolean;
};

/**
 * "Rasulbot" — an original toon-shaded robot developer.
 * Looks at the cursor, blinks, waves, and hops with squash & stretch when poked.
 */
export function ToonMascot({ bounceKey = 0, waving = true, ...props }: MascotProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  const jumpAt = useRef(-10);
  const happyUntil = useRef(0);
  const nextBlink = useRef(2);
  const clockNow = useRef(0);

  const poke = () => {
    jumpAt.current = clockNow.current;
    happyUntil.current = clockNow.current + 1.6;
  };

  useEffect(() => {
    if (!bounceKey) return;
    jumpAt.current = clockNow.current;
    happyUntil.current = clockNow.current + 1.6;
  }, [bounceKey]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    clockNow.current = t;
    const d = Math.min(delta, 0.05);

    // Hop with squash & stretch
    const jt = (t - jumpAt.current) / 0.75;
    let hop = 0;
    let squash = 1;
    if (jt >= 0 && jt < 1) {
      hop = Math.sin(Math.PI * jt) * 0.9;
      squash = jt < 0.12 ? 1 - jt * 1.6 : jt > 0.88 ? 1 - (1 - jt) * 1.6 : 1 + Math.sin(Math.PI * jt) * 0.12;
    } else if (jt >= 1 && jt < 1.3) {
      squash = 1 - Math.sin(((jt - 1) / 0.3) * Math.PI) * 0.12;
    }

    if (body.current) {
      const idle = Math.sin(t * 2.2) * 0.04;
      body.current.position.y = hop + idle;
      body.current.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      body.current.rotation.z = Math.sin(t * 1.1) * 0.04;
    }

    // Head follows the cursor
    if (head.current) {
      const targetY = windowPointer.x * 0.55;
      const targetX = -windowPointer.y * 0.3 + Math.sin(t * 1.3) * 0.03;
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, targetY, 5, d);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, targetX, 5, d);
      head.current.rotation.z = Math.sin(t * 1.7) * 0.05;
    }

    // Blink, or squint happily after a poke
    if (eyes.current) {
      const happy = t < happyUntil.current;
      let sy = happy ? 0.35 : 1;
      if (!happy && t > nextBlink.current) {
        const bt = t - nextBlink.current;
        if (bt < 0.14) sy = 0.1;
        else nextBlink.current = t + 2.2 + Math.random() * 2.8;
      }
      eyes.current.scale.y = THREE.MathUtils.damp(eyes.current.scale.y, sy, 30, d);
      eyes.current.position.x = windowPointer.x * 0.06;
      eyes.current.position.y = windowPointer.y * 0.04;
    }

    if (mouth.current) {
      const happy = t < happyUntil.current;
      const s = THREE.MathUtils.damp(mouth.current.scale.x, happy ? 1.5 : 1, 10, d);
      mouth.current.scale.set(s, s, 1);
    }

    // Arms: wave on the right, gentle swing on the left
    if (armR.current) {
      const excited = jt >= 0 && jt < 1.3;
      armR.current.rotation.z = waving || excited ? 2.4 + Math.sin(t * (excited ? 16 : 7)) * 0.45 : 0.15;
    }
    if (armL.current) armL.current.rotation.z = -0.18 - Math.sin(t * 2.2) * 0.08;

    if (antenna.current) {
      const m = antenna.current.material as THREE.MeshToonMaterial;
      m.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.4;
      antenna.current.position.x = Math.sin(t * 3) * 0.04;
    }
  });

  return (
    <group
      ref={root}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        poke();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <group ref={body}>
        {/* Torso */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.52, 0.45, 8, 24]} />
          <Toon color={CREAM} />
          <Ink />
        </mesh>
        {/* Chest badge */}
        <RoundedBox args={[0.42, 0.3, 0.1]} radius={0.06} position={[0, 0.02, 0.5]}>
          <Toon color={GOLD} />
          <Ink thickness={0.02} />
        </RoundedBox>
        <mesh position={[0, 0.02, 0.56]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#fff4d6" />
        </mesh>

        {/* Legs */}
        {[-0.24, 0.24].map((x) => (
          <group key={x} position={[x, -0.78, 0]}>
            <mesh>
              <capsuleGeometry args={[0.14, 0.18, 6, 12]} />
              <Toon color={CREAM} />
              <Ink />
            </mesh>
            <RoundedBox args={[0.3, 0.16, 0.42]} radius={0.07} position={[0, -0.2, 0.06]}>
              <Toon color={GOLD} />
              <Ink />
            </RoundedBox>
          </group>
        ))}

        {/* Arms (pivot at the shoulder) */}
        <group ref={armR} position={[0.56, 0.28, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.12, 0.36, 6, 12]} />
            <Toon color={CREAM} />
            <Ink />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <Toon color={GOLD} />
            <Ink />
          </mesh>
        </group>
        <group ref={armL} position={[-0.56, 0.28, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.12, 0.36, 6, 12]} />
            <Toon color={CREAM} />
            <Ink />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <Toon color={GOLD} />
            <Ink />
          </mesh>
        </group>

        {/* Head */}
        <group ref={head} position={[0, 1.08, 0]}>
          <RoundedBox args={[1.5, 1.12, 1.08]} radius={0.32} smoothness={5}>
            <Toon color={CREAM} />
            <Ink />
          </RoundedBox>
          {/* Face screen */}
          <RoundedBox args={[1.18, 0.78, 0.12]} radius={0.2} position={[0, -0.02, 0.5]}>
            <Toon color={SCREEN} />
            <Ink thickness={0.02} />
          </RoundedBox>
          <group ref={eyes}>
            {[-0.26, 0.26].map((x) => (
              <mesh key={x} position={[x, 0.06, 0.58]}>
                <capsuleGeometry args={[0.075, 0.12, 6, 12]} />
                <meshBasicMaterial color={GLOW} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh ref={mouth} position={[0, -0.14, 0.58]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.1, 0.025, 8, 24, Math.PI]} />
            <meshBasicMaterial color={GLOW} toneMapped={false} />
          </mesh>
          {[-0.44, 0.44].map((x) => (
            <mesh key={x} position={[x, -0.16, 0.57]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color={BLUSH} transparent opacity={0.85} />
            </mesh>
          ))}
          {/* Ears */}
          {[-0.79, 0.79].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
              <Toon color={GOLD} />
              <Ink thickness={0.025} />
            </mesh>
          ))}
          {/* Antenna */}
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.34, 8]} />
            <Toon color={INK_SOFT} />
          </mesh>
          <mesh ref={antenna} position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <Toon color="#ffcf6b" emissive="#ffb12e" emissiveIntensity={1} />
            <Ink thickness={0.025} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

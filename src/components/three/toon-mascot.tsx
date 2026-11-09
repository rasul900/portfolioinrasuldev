"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Ink, Toon, windowPointer } from "./toon-kit";

const CREAM = "#f4efe6";
const GOLD = "#e3a94f";
const DARK = "#24223a";
const GLOW = "#7ff3ff";
const BLUSH = "#ff8fab";
const HEART = "#ff5d8f";
const FLAME_OUT = "#ff9a3c";
const FLAME_IN = "#fff1a8";

type Mood = "normal" | "happy" | "love";
type Trick = "hop" | "flip" | "spin";
const TRICKS: { trick: Trick; mood: Mood }[] = [
  { trick: "hop", mood: "happy" },
  { trick: "flip", mood: "love" },
  { trick: "spin", mood: "happy" },
];

type MascotProps = ThreeElements["group"] & {
  /** Change this number to make the mascot do a trick (e.g. on a new speech bubble). */
  bounceKey?: number;
  /** Keep waving the right arm. */
  waving?: boolean;
};

function useHeartGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(25, 25);
    s.bezierCurveTo(25, 25, 20, 0, 0, 0);
    s.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    s.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    s.bezierCurveTo(60, 77, 80, 55, 80, 35);
    s.bezierCurveTo(80, 35, 80, 0, 50, 0);
    s.bezierCurveTo(35, 0, 25, 25, 25, 25);
    const g = new THREE.ExtrudeGeometry(s, { depth: 6, bevelEnabled: false });
    g.scale(0.0021, -0.0021, 0.0021);
    g.center();
    return g;
  }, []);
}

function useMicCurve() {
  return useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.9, -0.12, 0.08),
        new THREE.Vector3(-0.86, -0.42, 0.36),
        new THREE.Vector3(-0.56, -0.5, 0.66),
        new THREE.Vector3(-0.3, -0.42, 0.72),
      ]),
    []
  );
}

/**
 * "Rasulbot" — an original toon-shaded robot developer with headphones and a jetpack.
 * Looks at the cursor, blinks, glances at its laptop, waves, and does tricks when poked.
 */
export function ToonMascot({ bounceKey = 0, waving = true, ...props }: MascotProps) {
  const body = useRef<THREE.Group>(null);
  const acro = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const brows = useRef<THREE.Group>(null);
  const eyesNormal = useRef<THREE.Group>(null);
  const eyesHappy = useRef<THREE.Group>(null);
  const eyesLove = useRef<THREE.Group>(null);
  const mouthSmile = useRef<THREE.Mesh>(null);
  const mouthOpen = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.Group>(null);
  const antennaBulb = useRef<THREE.Mesh>(null);
  const flames = useRef<THREE.Group>(null);
  const leds = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Group>(null);

  const heartGeo = useHeartGeometry();
  const micCurve = useMicCurve();

  const state = useRef({
    now: 0,
    trickAt: -10,
    trickIndex: -1,
    mood: "normal" as Mood,
    moodUntil: 0,
    nextBlink: 2,
    nextGlance: 7,
    antAngle: 0,
    antVel: 0,
    prevY: 0,
    prevV: 0,
  });

  const startTrick = () => {
    const s = state.current;
    s.trickIndex = (s.trickIndex + 1) % TRICKS.length;
    s.trickAt = s.now;
    s.mood = TRICKS[s.trickIndex].mood;
    s.moodUntil = s.now + 2;
  };

  useEffect(() => {
    if (!bounceKey) return;
    const s = state.current;
    s.trickIndex = (s.trickIndex + 1) % TRICKS.length;
    s.trickAt = s.now;
    s.mood = TRICKS[s.trickIndex].mood;
    s.moodUntil = s.now + 2;
  }, [bounceKey]);

  useFrame((frame, delta) => {
    const s = state.current;
    const t = frame.clock.elapsedTime;
    s.now = t;
    const d = Math.min(delta, 0.05);
    const damp = THREE.MathUtils.damp;

    // ── Trick timeline (hop / flip / spin) with squash & stretch
    const trick = s.trickIndex >= 0 ? TRICKS[s.trickIndex].trick : "hop";
    const dur = trick === "hop" ? 0.75 : 1.05;
    const jt = (t - s.trickAt) / dur;
    const airborne = jt >= 0 && jt < 1;
    let hop = 0;
    let squash = 1;
    if (airborne) {
      const height = trick === "hop" ? 0.9 : 1.5;
      hop = Math.sin(Math.PI * jt) * height;
      squash = jt < 0.1 ? 1 - jt * 2 : jt > 0.9 ? 1 - (1 - jt) * 2 : 1 + Math.sin(Math.PI * jt) * 0.1;
    } else if (jt >= 1 && jt < 1.3) {
      squash = 1 - Math.sin(((jt - 1) / 0.3) * Math.PI) * 0.14;
    }
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    if (body.current) {
      body.current.position.y = hop + Math.sin(t * 2.2) * 0.035;
      const w = 1 / Math.sqrt(squash);
      body.current.scale.set(w, squash, w);
      body.current.rotation.z = Math.sin(t * 1.1) * 0.035;
    }
    if (acro.current) {
      const p = airborne ? ease(Math.min(Math.max((jt - 0.08) / 0.84, 0), 1)) : 0;
      acro.current.rotation.x = trick === "flip" ? -p * Math.PI * 2 : 0;
      acro.current.rotation.y = trick === "spin" ? p * Math.PI * 2 : 0;
    }
    if (torso.current) {
      const b = 1 + Math.sin(t * 2.2) * 0.015;
      torso.current.scale.set(b, 1.05, 0.92 * b);
    }

    // ── Jetpack flames while airborne
    if (flames.current) {
      const f = airborne ? Math.sin(Math.PI * Math.min(jt * 1.4, 1)) : 0;
      const flick = 0.85 + Math.sin(t * 60) * 0.15;
      const target = Math.max(f * flick, 0.0001);
      flames.current.scale.y = damp(flames.current.scale.y, target, 25, d);
      flames.current.visible = flames.current.scale.y > 0.02;
    }

    // ── Head: follow cursor, occasionally glance at the laptop
    if (head.current) {
      if (t > s.nextGlance + 1.6) s.nextGlance = t + 7 + Math.random() * 5;
      const glancing = t > s.nextGlance;
      const ty = glancing ? -0.7 : windowPointer.x * 0.55;
      const tx = glancing ? 0.3 : -windowPointer.y * 0.3 + Math.sin(t * 1.3) * 0.03;
      head.current.rotation.y = damp(head.current.rotation.y, ty, 5, d);
      head.current.rotation.x = damp(head.current.rotation.x, tx, 5, d);
      head.current.rotation.z = damp(head.current.rotation.z, Math.sin(t * 1.7) * 0.05 + (airborne ? 0.12 : 0), 6, d);
    }

    // ── Face: mood, blink, eye tracking
    if (t > s.moodUntil) s.mood = "normal";
    if (eyesNormal.current) eyesNormal.current.visible = s.mood === "normal";
    if (eyesHappy.current) eyesHappy.current.visible = s.mood === "happy";
    if (eyesLove.current) {
      eyesLove.current.visible = s.mood === "love";
      const pulse = 1 + Math.sin(t * 14) * 0.12;
      eyesLove.current.scale.setScalar(pulse);
    }
    if (mouthSmile.current) mouthSmile.current.visible = s.mood === "normal";
    if (mouthOpen.current) mouthOpen.current.visible = s.mood !== "normal";

    if (eyes.current) {
      let sy = 1;
      if (s.mood === "normal" && t > s.nextBlink) {
        if (t - s.nextBlink < 0.13) sy = 0.08;
        else s.nextBlink = t + 2.2 + Math.random() * 2.8;
      }
      eyes.current.scale.y = damp(eyes.current.scale.y, sy, 35, d);
      eyes.current.position.x = damp(eyes.current.position.x, windowPointer.x * 0.07, 8, d);
      eyes.current.position.y = damp(eyes.current.position.y, windowPointer.y * 0.045, 8, d);
    }
    if (brows.current) {
      brows.current.position.y = damp(brows.current.position.y, airborne ? 0.07 : 0, 12, d);
    }

    // ── Arms
    if (armR.current) {
      const excited = jt >= 0 && jt < 1.3;
      const target = waving || excited ? 2.5 + Math.sin(t * (excited ? 16 : 7)) * 0.45 : 0.2;
      armR.current.rotation.z = damp(armR.current.rotation.z, target, 10, d);
    }
    if (armL.current) {
      const target = airborne ? -2.3 : -0.2 - Math.sin(t * 2.2) * 0.08;
      armL.current.rotation.z = damp(armL.current.rotation.z, target, 10, d);
    }

    // ── Springy antenna driven by body acceleration
    if (antenna.current && body.current) {
      const y = body.current.position.y;
      const v = (y - s.prevY) / Math.max(d, 0.001);
      const a = (v - s.prevV) / Math.max(d, 0.001);
      s.prevY = y;
      s.prevV = v;
      const force = -60 * s.antAngle - 5 * s.antVel + THREE.MathUtils.clamp(a, -60, 60) * 0.03;
      s.antVel += force * d;
      s.antAngle += s.antVel * d;
      antenna.current.rotation.z = -0.25 + s.antAngle + Math.sin(t * 2.6) * 0.06;
    }
    if (antennaBulb.current) {
      (antennaBulb.current.material as THREE.MeshToonMaterial).emissiveIntensity = 0.9 + Math.sin(t * 4) * 0.45;
    }

    // ── Headphone LEDs and chest equalizer
    if (leds.current) {
      const c = 0.6 + Math.sin(t * 3) * 0.4;
      leds.current.children.forEach((m) => ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setRGB(0.5 * c, 0.95 * c, 1 * c));
    }
    if (bars.current) {
      bars.current.children.forEach((m, i) => {
        const h = 0.35 + Math.abs(Math.sin(t * (4 + i * 1.3) + i * 1.7)) * 0.65;
        m.scale.y = h;
        m.position.y = -0.1 + (0.2 * h) / 2;
      });
    }
  });

  const arm = (side: 1 | -1, ref: React.RefObject<THREE.Group | null>) => (
    <group ref={ref} position={[0.58 * side, 0.3, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <Toon color={GOLD} />
        <Ink thickness={0.02} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <capsuleGeometry args={[0.11, 0.3, 6, 12]} />
        <Toon color={CREAM} />
        <Ink />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 20]} />
        <Toon color={GOLD} />
      </mesh>
      <mesh position={[0, -0.64, 0]} scale={[1, 0.95, 0.85]}>
        <sphereGeometry args={[0.17, 18, 18]} />
        <Toon color={CREAM} />
        <Ink />
      </mesh>
      <mesh position={[0.1 * side, -0.58, 0.07]} rotation={[0, 0, -0.6 * side]}>
        <capsuleGeometry args={[0.055, 0.08, 4, 10]} />
        <Toon color={CREAM} />
        <Ink thickness={0.015} />
      </mesh>
    </group>
  );

  return (
    <group
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        startTrick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <group ref={body}>
        <group ref={acro} position={[0, 0.45, 0]}>
          <group position={[0, -0.45, 0]}>
            {/* ── Torso */}
            <mesh ref={torso}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <Toon color={CREAM} />
              <Ink />
            </mesh>
            {/* Chest screen with live equalizer */}
            <RoundedBox args={[0.56, 0.38, 0.12]} radius={0.08} position={[0, 0.04, 0.5]} rotation={[-0.08, 0, 0]}>
              <Toon color={DARK} />
              <Ink thickness={0.02} />
            </RoundedBox>
            <group ref={bars} position={[0, 0.04, 0.575]}>
              {[-0.16, -0.08, 0, 0.08, 0.16].map((x, i) => (
                <mesh key={x} position={[x, 0, 0]}>
                  <boxGeometry args={[0.045, 0.2, 0.01]} />
                  <meshBasicMaterial color={i % 2 ? "#ffd27a" : GLOW} toneMapped={false} />
                </mesh>
              ))}
            </group>
            {/* Belt */}
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.92, 1]}>
              <torusGeometry args={[0.53, 0.05, 10, 40]} />
              <Toon color={GOLD} />
              <Ink thickness={0.015} />
            </mesh>

            {/* ── Jetpack */}
            <group position={[0, 0.05, -0.55]}>
              <RoundedBox args={[0.74, 0.68, 0.32]} radius={0.12}>
                <Toon color={GOLD} />
                <Ink />
              </RoundedBox>
              {[-0.2, 0.2].map((x) => (
                <group key={x} position={[x, -0.38, -0.02]}>
                  <mesh>
                    <cylinderGeometry args={[0.1, 0.13, 0.16, 16]} />
                    <Toon color={DARK} />
                    <Ink thickness={0.015} />
                  </mesh>
                </group>
              ))}
              <group ref={flames} position={[0, -0.46, -0.02]} scale={[1, 0.0001, 1]}>
                {[-0.2, 0.2].map((x) => (
                  <group key={x} position={[x, 0, 0]}>
                    <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
                      <coneGeometry args={[0.11, 0.42, 14]} />
                      <meshBasicMaterial color={FLAME_OUT} toneMapped={false} transparent opacity={0.9} />
                    </mesh>
                    <mesh position={[0, -0.13, 0]} rotation={[Math.PI, 0, 0]}>
                      <coneGeometry args={[0.06, 0.26, 12]} />
                      <meshBasicMaterial color={FLAME_IN} toneMapped={false} />
                    </mesh>
                  </group>
                ))}
              </group>
            </group>

            {/* ── Legs & boots */}
            {[-0.24, 0.24].map((x) => (
              <group key={x} position={[x, -0.66, 0]}>
                <mesh>
                  <capsuleGeometry args={[0.12, 0.14, 6, 12]} />
                  <Toon color={DARK} />
                  <Ink thickness={0.02} />
                </mesh>
                <RoundedBox args={[0.32, 0.2, 0.44]} radius={0.09} position={[0, -0.2, 0.06]}>
                  <Toon color={GOLD} />
                  <Ink />
                </RoundedBox>
                <RoundedBox args={[0.34, 0.06, 0.46]} radius={0.03} position={[0, -0.3, 0.06]}>
                  <Toon color={DARK} />
                </RoundedBox>
              </group>
            ))}

            {arm(1, armR)}
            {arm(-1, armL)}

            {/* Neck */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.16, 16]} />
              <Toon color={DARK} />
              <Ink thickness={0.015} />
            </mesh>

            {/* ── Head */}
            <group ref={head} position={[0, 1.2, 0]}>
              <RoundedBox args={[1.6, 1.24, 1.18]} radius={0.4} smoothness={6}>
                <Toon color={CREAM} />
                <Ink />
              </RoundedBox>

              {/* Visor */}
              <RoundedBox args={[1.3, 0.9, 0.14]} radius={0.28} position={[0, -0.03, 0.55]}>
                <Toon color={DARK} />
                <Ink thickness={0.02} />
              </RoundedBox>
              {/* Visor glare */}
              <mesh position={[-0.38, 0.22, 0.627]} rotation={[0, 0, 0.6]}>
                <planeGeometry args={[0.07, 0.3]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
              </mesh>
              <mesh position={[-0.27, 0.27, 0.627]} rotation={[0, 0, 0.6]}>
                <planeGeometry args={[0.035, 0.16]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
              </mesh>

              {/* Eyes */}
              <group ref={eyes} position={[0, 0.05, 0.635]}>
                <group ref={eyesNormal}>
                  {[-0.27, 0.27].map((x) => (
                    <group key={x} position={[x, 0, 0]}>
                      <mesh>
                        <capsuleGeometry args={[0.095, 0.13, 8, 16]} />
                        <meshBasicMaterial color={GLOW} toneMapped={false} />
                      </mesh>
                      <mesh position={[-0.035, 0.07, 0.1]}>
                        <circleGeometry args={[0.035, 16]} />
                        <meshBasicMaterial color="#ffffff" toneMapped={false} />
                      </mesh>
                      <mesh position={[0.03, -0.05, 0.1]}>
                        <circleGeometry args={[0.016, 12]} />
                        <meshBasicMaterial color="#ffffff" toneMapped={false} />
                      </mesh>
                    </group>
                  ))}
                </group>
                <group ref={eyesHappy} visible={false}>
                  {[-0.27, 0.27].map((x) => (
                    <mesh key={x} position={[x, -0.02, 0]}>
                      <torusGeometry args={[0.09, 0.03, 8, 20, Math.PI]} />
                      <meshBasicMaterial color={GLOW} toneMapped={false} />
                    </mesh>
                  ))}
                </group>
                <group ref={eyesLove} visible={false}>
                  {[-0.27, 0.27].map((x) => (
                    <mesh key={x} position={[x, 0, 0]} geometry={heartGeo}>
                      <meshBasicMaterial color={HEART} toneMapped={false} side={THREE.DoubleSide} />
                    </mesh>
                  ))}
                </group>
              </group>

              {/* Brows */}
              <group ref={brows}>
                {[-0.27, 0.27].map((x) => (
                  <mesh key={x} position={[x, 0.27, 0.63]} rotation={[0, 0, Math.PI / 2 + (x < 0 ? -0.15 : 0.15)]}>
                    <capsuleGeometry args={[0.018, 0.1, 4, 8]} />
                    <meshBasicMaterial color={GLOW} toneMapped={false} transparent opacity={0.8} />
                  </mesh>
                ))}
              </group>

              {/* Mouth */}
              <mesh ref={mouthSmile} position={[0, -0.2, 0.635]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.08, 0.022, 8, 24, Math.PI]} />
                <meshBasicMaterial color={GLOW} toneMapped={false} />
              </mesh>
              <mesh ref={mouthOpen} position={[0, -0.16, 0.635]} visible={false}>
                <circleGeometry args={[0.12, 24, Math.PI, Math.PI]} />
                <meshBasicMaterial color={GLOW} toneMapped={false} />
              </mesh>

              {/* Blush */}
              {[-0.47, 0.47].map((x) => (
                <mesh key={x} position={[x, -0.17, 0.63]} scale={[1.4, 0.8, 1]}>
                  <circleGeometry args={[0.06, 16]} />
                  <meshBasicMaterial color={BLUSH} transparent opacity={0.8} />
                </mesh>
              ))}

              {/* ── Headphones */}
              <mesh position={[0, 0.02, 0]}>
                <torusGeometry args={[0.86, 0.065, 12, 40, Math.PI]} />
                <Toon color={DARK} />
                <Ink thickness={0.02} />
              </mesh>
              {[-1, 1].map((side) => (
                <group key={side} position={[0.86 * side, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh>
                    <cylinderGeometry args={[0.32, 0.32, 0.2, 28]} />
                    <Toon color={GOLD} />
                    <Ink thickness={0.025} />
                  </mesh>
                  <mesh position={[0, 0.11 * side, 0]}>
                    <cylinderGeometry args={[0.24, 0.24, 0.04, 24]} />
                    <Toon color={DARK} />
                  </mesh>
                </group>
              ))}
              <group ref={leds}>
                {[-1, 1].map((side) => (
                  <mesh key={side} position={[0.975 * side, 0, 0]} rotation={[0, (Math.PI / 2) * side, 0]}>
                    <torusGeometry args={[0.18, 0.025, 8, 28]} />
                    <meshBasicMaterial color={GLOW} toneMapped={false} />
                  </mesh>
                ))}
              </group>
              {/* Mic boom */}
              <mesh>
                <tubeGeometry args={[micCurve, 24, 0.025, 8, false]} />
                <Toon color={DARK} />
              </mesh>
              <mesh position={[-0.28, -0.42, 0.73]}>
                <sphereGeometry args={[0.065, 14, 14]} />
                <Toon color={DARK} />
                <Ink thickness={0.015} />
              </mesh>

              {/* ── Springy antenna */}
              <group ref={antenna} position={[0.42, 0.56, 0.1]}>
                <mesh position={[0, 0.2, 0]}>
                  <cylinderGeometry args={[0.025, 0.03, 0.4, 8]} />
                  <Toon color={DARK} />
                </mesh>
                <mesh ref={antennaBulb} position={[0, 0.44, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <Toon color="#ffcf6b" emissive="#ffb12e" emissiveIntensity={1} />
                  <Ink thickness={0.02} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

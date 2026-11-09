"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Outlines, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getGradientMap, INK, windowPointer } from "./toon-kit";

export const ROBOT_URL = "/models/robot.glb";

const LEGS = ["Leg_FL", "Leg_FR", "Leg_BL", "Leg_BR"] as const;
type LegName = (typeof LEGS)[number];

type Trick = "hop" | "spin" | "dance" | "wave";
const TRICKS: Trick[] = ["hop", "wave", "spin", "dance"];
const DURATION: Record<Trick, number> = { hop: 0.8, spin: 1.2, dance: 1.8, wave: 1.6 };

/** Cartoon versions of the model's original materials, matched by name. */
const TOON_COLORS: Record<string, { color: string; emissive?: string }> = {
  lambert1: { color: "#f4f1ea" },
  MetalShiny: { color: "#a3a1ad" },
  Metal: { color: "#5d5a68" },
  Rubber: { color: "#2a2730" },
  BlackGlass: { color: "#1c1a26" },
  lambert4: { color: "#9dff5c", emissive: "#5dff2a" },
  pasted__Eyes: { color: "#e9fff9", emissive: "#bff8ff" },
};

function makeToonMaterial(name: string) {
  const spec = TOON_COLORS[name] ?? { color: "#cccccc" };
  const m = new THREE.MeshToonMaterial({ color: spec.color, gradientMap: getGradientMap() });
  if (spec.emissive) {
    m.emissive = new THREE.Color(spec.emissive);
    m.emissiveIntensity = 0.9;
  }
  m.name = name;
  return m;
}

/** Renders every mesh under a GLB node with toon shading and an ink outline. */
function ToonPart({ node, materials }: { node: THREE.Object3D; materials: Map<string, THREE.Material> }) {
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    node.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      // Skip meshes that belong to nested part groups (e.g. the eyes under the head)
      for (let p = o.parent; p && p !== node; p = p.parent) if (/^(Eye_[LR]|Leg_..)$/.test(p.name)) return;
      list.push(o as THREE.Mesh);
    });
    return list;
  }, [node]);

  return (
    <>
      {meshes.map((m) => {
        const name = (Array.isArray(m.material) ? m.material[0] : m.material).name;
        const glow = name === "lambert4" || name === "pasted__Eyes";
        return (
          <mesh key={m.uuid} geometry={m.geometry} material={materials.get(name)}>
            {!glow && <Outlines thickness={0.05} color={INK} />}
          </mesh>
        );
      })}
    </>
  );
}

type RobotProps = ThreeElements["group"] & {
  /** Change this number to make the robot do its next trick. */
  bounceKey?: number;
  /** Wave hello every few seconds on its own. */
  waving?: boolean;
};

/**
 * The user's four-legged robot model, split into body / head / eyes / legs
 * and animated procedurally: looks at the cursor, blinks, fidgets its legs,
 * and does hop / wave / spin / dance tricks when clicked.
 */
export function RobotModel({ bounceKey = 0, waving = true, ...props }: RobotProps) {
  const { nodes, materials: gltfMaterials } = useGLTF(ROBOT_URL);

  const materials = useMemo(() => {
    const map = new Map<string, THREE.Material>();
    Object.keys(gltfMaterials).forEach((name) => map.set(name, makeToonMaterial(name)));
    return map;
  }, [gltfMaterials]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const legAxes = useMemo(() => {
    const axes = {} as Record<LegName, THREE.Vector3>;
    LEGS.forEach((leg) => {
      const a = (nodes[leg]?.userData?.liftAxis as number[] | undefined) ?? [0, 0, 1];
      axes[leg] = new THREE.Vector3(...a).normalize();
    });
    return axes;
  }, [nodes]);

  const upper = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const legRefs = useRef<Partial<Record<LegName, THREE.Group | null>>>({});

  const s = useRef({
    now: 0,
    trick: "hop" as Trick,
    trickAt: -10,
    trickIndex: -1,
    happyUntil: 0,
    nextBlink: 1.5,
    nextFidget: 2,
    fidgetLeg: "Leg_FL" as LegName,
    nextWave: 4,
    tilt: 0,
  });

  const startTrick = (forced?: Trick) => {
    const st = s.current;
    if (!forced) st.trickIndex = (st.trickIndex + 1) % TRICKS.length;
    st.trick = forced ?? TRICKS[st.trickIndex];
    st.trickAt = st.now;
    st.happyUntil = st.now + DURATION[st.trick] + 0.6;
  };

  useEffect(() => {
    if (!bounceKey) return;
    const st = s.current;
    st.trickIndex = (st.trickIndex + 1) % TRICKS.length;
    st.trick = TRICKS[st.trickIndex];
    st.trickAt = st.now;
    st.happyUntil = st.now + DURATION[st.trick] + 0.6;
  }, [bounceKey]);

  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((frame, delta) => {
    const st = s.current;
    const t = frame.clock.elapsedTime;
    st.now = t;
    const d = Math.min(delta, 0.05);
    const damp = THREE.MathUtils.damp;

    if (waving && t > st.nextWave) {
      st.nextWave = t + 7 + Math.random() * 4;
      if (t - st.trickAt > DURATION[st.trick] + 2) startTrick("wave");
    }

    const p = (t - st.trickAt) / DURATION[st.trick];
    const active = p >= 0 && p < 1;
    const trick = active ? st.trick : null;
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    // ── Body: idle bob, hop arc with squash & stretch, dance sway
    let y = Math.sin(t * 2.4) * 0.06;
    let sq = 1;
    let roll = Math.sin(t * 1.2) * 0.02;
    if (trick === "hop") {
      y += Math.sin(Math.PI * p) * 1.7;
      sq = p < 0.12 ? 1 - p * 1.5 : p > 0.88 ? 1 - (1 - p) * 1.5 : 1 + Math.sin(Math.PI * p) * 0.08;
    } else if (trick === "dance") {
      roll = Math.sin(p * Math.PI * 6) * 0.16;
      y += Math.abs(Math.sin(p * Math.PI * 6)) * 0.35;
    } else if (trick === "spin") {
      y += Math.sin(Math.PI * p) * 0.6;
    }
    const landing = !active && t - st.trickAt < DURATION[st.trick] + 0.3 && st.trick === "hop";
    if (landing) sq = 1 - Math.sin(((t - st.trickAt - DURATION.hop) / 0.3) * Math.PI) * 0.12;

    if (upper.current) {
      upper.current.position.y = y;
      const w = 1 / Math.sqrt(sq);
      upper.current.scale.set(w, sq, w);
      upper.current.rotation.x = damp(upper.current.rotation.x, roll, 10, d);
    }
    if (spinner.current) {
      spinner.current.rotation.y = trick === "spin" ? ease(p) * Math.PI * 2 : 0;
    }

    // ── Head: follow the cursor, curious tilt, bob while dancing
    if (head.current) {
      const yaw = windowPointer.x * 0.6;
      const pitch = windowPointer.y * 0.28 + (trick === "dance" ? Math.sin(p * Math.PI * 12) * 0.12 : 0);
      if (Math.random() < 0.003) st.tilt = (Math.random() - 0.5) * 0.5;
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 5, d);
      head.current.rotation.z = damp(head.current.rotation.z, pitch, 5, d);
      head.current.rotation.x = damp(head.current.rotation.x, st.tilt + (trick === "wave" ? 0.25 : 0), 3, d);
    }

    // ── Eyes: blink, or squint happily after a trick
    const happy = t < st.happyUntil;
    let eyeScale = happy ? 0.4 : 1;
    if (!happy && t > st.nextBlink) {
      if (t - st.nextBlink < 0.13) eyeScale = 0.08;
      else st.nextBlink = t + 2 + Math.random() * 3;
    }
    [eyeL.current, eyeR.current].forEach((e) => {
      if (e) e.scale.y = damp(e.scale.y, eyeScale, 30, d);
    });

    // ── Glowing stripes pulse
    const lights = materials.get("lambert4") as THREE.MeshToonMaterial | undefined;
    if (lights) lights.emissiveIntensity = 0.7 + Math.sin(t * 3.2) * 0.35 + (active ? 0.5 : 0);

    // ── Legs
    if (!active && t > st.nextFidget) {
      st.fidgetLeg = LEGS[Math.floor(Math.random() * LEGS.length)];
      st.nextFidget = t + 2.5 + Math.random() * 2.5;
    }
    const fidgetT = t - (st.nextFidget - 2.5);
    LEGS.forEach((leg, i) => {
      const g = legRefs.current[leg];
      if (!g) return;
      let a = 0;
      const diagonal = i === 0 || i === 3 ? 0 : Math.PI;
      if (trick === "hop") a = Math.sin(Math.PI * p) * 0.55;
      else if (trick === "spin") a = Math.max(0, Math.sin(p * Math.PI * 10 + diagonal)) * 0.45;
      else if (trick === "dance") a = Math.max(0, Math.sin(p * Math.PI * 6 + diagonal)) * 0.5;
      else if (trick === "wave" && leg === "Leg_FL") {
        const up = Math.sin(Math.min(p / 0.2, 1) * (Math.PI / 2)) * (p > 0.85 ? (1 - p) / 0.15 : 1);
        a = up * (1.05 + Math.sin(p * Math.PI * 8) * 0.25);
      } else if (!active && leg === st.fidgetLeg && fidgetT > 0 && fidgetT < 0.5) {
        a = Math.sin((fidgetT / 0.5) * Math.PI) * 0.3;
      }
      const cur = g.userData.angle ?? 0;
      const next = damp(cur, a, 18, d);
      g.userData.angle = next;
      q.setFromAxisAngle(legAxes[leg], next);
      g.quaternion.copy(q);
    });
  });

  const n = nodes as Record<string, THREE.Object3D>;

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
      {/* The model faces +X; turn it toward the camera */}
      <group ref={spinner}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <group ref={upper}>
            <ToonPart node={n.Body} materials={materials} />
            <group ref={head} position={n.Head.position}>
              <ToonPart node={n.Head} materials={materials} />
              <group ref={eyeL} position={n.Eye_L.position}>
                <ToonPart node={n.Eye_L} materials={materials} />
              </group>
              <group ref={eyeR} position={n.Eye_R.position}>
                <ToonPart node={n.Eye_R} materials={materials} />
              </group>
            </group>
            {LEGS.map((leg) => (
              <group
                key={leg}
                position={n[leg].position}
                ref={(el) => {
                  legRefs.current[leg] = el;
                }}
              >
                <ToonPart node={n[leg]} materials={materials} />
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ROBOT_URL);

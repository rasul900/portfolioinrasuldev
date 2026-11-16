"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { windowPointer } from "./pointer";

export const ROBOT_URL = "/models/robot.glb";

const LEGS = ["Leg_FL", "Leg_FR", "Leg_BL", "Leg_BR"] as const;
type LegName = (typeof LEGS)[number];

export type RobotAction = "scan" | "deploy";
const ACTIONS: RobotAction[] = ["scan", "deploy"];
const DURATION: Record<RobotAction, number> = { scan: 2.4, deploy: 1.8 };

/**
 * Shared, per-frame state the rest of the scene reads (holo screens, keyboard).
 * Times are in the scene clock (seconds).
 */
export const robotSignal = {
  action: "scan" as RobotAction,
  at: -100,
  typing: false,
  lastTap: -100,
};

const ACCENT = "#38e1ff";

/** Physically based versions of the model's original materials, matched by name. */
function makeMaterial(name: string) {
  switch (name) {
    case "lambert1": // main shell
      return new THREE.MeshPhysicalMaterial({ color: "#e6e4df", roughness: 0.32, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.25 });
    case "MetalShiny":
      return new THREE.MeshStandardMaterial({ color: "#9a9ea8", roughness: 0.22, metalness: 0.95 });
    case "Metal":
      return new THREE.MeshStandardMaterial({ color: "#3b3f49", roughness: 0.38, metalness: 0.85 });
    case "Rubber":
      return new THREE.MeshStandardMaterial({ color: "#121318", roughness: 0.9, metalness: 0 });
    case "BlackGlass": // visor
      return new THREE.MeshPhysicalMaterial({ color: "#05070c", roughness: 0.14, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, reflectivity: 0.7 });
    case "lambert4": // light strips
      return new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 2, toneMapped: false });
    case "pasted__Eyes":
      return new THREE.MeshStandardMaterial({ color: "#c9fbff", emissive: "#7ff3ff", emissiveIntensity: 3, toneMapped: false });
    default:
      return new THREE.MeshStandardMaterial({ color: "#8a8a8a", roughness: 0.5 });
  }
}

/** Renders the meshes directly under a GLB part node (not those of nested parts). */
function Part({ node, materials }: { node: THREE.Object3D; materials: Map<string, THREE.Material> }) {
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    node.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      for (let p = o.parent; p && p !== node; p = p.parent) if (/^(Eye_[LR]|Leg_..)$/.test(p.name)) return;
      list.push(o as THREE.Mesh);
    });
    return list;
  }, [node]);

  return (
    <>
      {meshes.map((m) => {
        const name = (Array.isArray(m.material) ? m.material[0] : m.material).name;
        return <mesh key={m.uuid} geometry={m.geometry} material={materials.get(name)} />;
      })}
    </>
  );
}

type RobotProps = ThreeElements["group"] & {
  /** Change this number to run the next action (scan / deploy). */
  bounceKey?: number;
  /** Type on the holo keyboard between actions. */
  typing?: boolean;
  /** Publish actions to `robotSignal` so screens in the same scene can react. */
  broadcast?: boolean;
};

/**
 * The four-legged dev robot: focused LED eyes, tracks the cursor, types on its
 * holo keyboard when you leave it alone, and runs a visor scan or a "deploy"
 * stance when clicked.
 */
export function RobotModel({ bounceKey = 0, typing = true, broadcast = false, ...props }: RobotProps) {
  const { nodes, materials: gltfMaterials } = useGLTF(ROBOT_URL);

  const materials = useMemo(() => {
    const map = new Map<string, THREE.Material>();
    Object.keys(gltfMaterials).forEach((name) => {
      const m = makeMaterial(name);
      m.name = name;
      map.set(name, m);
    });
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
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const legRefs = useRef<Partial<Record<LegName, THREE.Group | null>>>({});

  const s = useRef({
    now: 0,
    action: "scan" as RobotAction,
    at: -100,
    index: -1,
    nextBlink: 1.5,
    lastPointer: { x: 0, y: 0 },
    pointerMovedAt: 0,
  });

  const run = () => {
    const st = s.current;
    st.index = (st.index + 1) % ACTIONS.length;
    st.action = ACTIONS[st.index];
    st.at = st.now;
    if (broadcast) {
      robotSignal.action = st.action;
      robotSignal.at = st.now;
    }
  };

  useEffect(() => {
    if (!bounceKey) return;
    const st = s.current;
    st.index = (st.index + 1) % ACTIONS.length;
    st.action = ACTIONS[st.index];
    st.at = st.now;
  }, [bounceKey]);

  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((frame, delta) => {
    const st = s.current;
    const t = frame.clock.elapsedTime;
    st.now = t;
    const d = Math.min(delta, 0.05);
    const damp = THREE.MathUtils.damp;

    const p = (t - st.at) / DURATION[st.action];
    const active = p >= 0 && p < 1;
    const action = active ? st.action : null;
    const env = active ? Math.sin(Math.min(p / 0.15, 1) * (Math.PI / 2)) * Math.min((1 - p) / 0.15, 1) : 0;

    // Is the visitor idle? Then the robot gets back to coding.
    const pm = windowPointer;
    if (Math.abs(pm.x - st.lastPointer.x) + Math.abs(pm.y - st.lastPointer.y) > 0.002) {
      st.pointerMovedAt = t;
      st.lastPointer = { x: pm.x, y: pm.y };
    }
    const isTyping = typing && !active && t - st.pointerMovedAt > 2.2 && Math.sin(t * 0.45) > -0.6;
    if (broadcast) robotSignal.typing = isTyping;

    // ── Body: calm breathing, rises into a "deploy" stance
    if (upper.current) {
      const rise = action === "deploy" ? env * 0.55 : 0;
      upper.current.position.y = damp(upper.current.position.y, Math.sin(t * 1.6) * 0.025 + rise, 8, d);
    }

    // ── Head: track the cursor, look down at the keyboard while typing, sweep while scanning
    if (head.current) {
      let yaw = pm.x * 0.55;
      let pitch = pm.y * 0.25;
      if (isTyping) {
        yaw = Math.sin(t * 0.7) * 0.08;
        pitch = -0.32;
      }
      if (action === "scan") {
        yaw = Math.sin(p * Math.PI * 2) * 0.75 * env;
        pitch = -0.05;
      } else if (action === "deploy") {
        yaw = 0;
        pitch = 0.12 * env;
      }
      head.current.rotation.y = damp(head.current.rotation.y, yaw, action ? 6 : 3.5, d);
      head.current.rotation.z = damp(head.current.rotation.z, pitch, action ? 6 : 3.5, d);
    }

    // ── Eyes: narrow, focused LEDs; tighten during a scan
    let eyeScale = action === "scan" ? 0.32 : action === "deploy" ? 0.75 : 0.55;
    if (!active && t > st.nextBlink) {
      if (t - st.nextBlink < 0.12) eyeScale = 0.06;
      else st.nextBlink = t + 2.5 + Math.random() * 3.5;
    }
    [eyeL.current, eyeR.current].forEach((e) => {
      if (e) e.scale.y = damp(e.scale.y, eyeScale, 25, d);
    });
    const eyes = materials.get("pasted__Eyes") as THREE.MeshStandardMaterial | undefined;
    if (eyes) eyes.emissiveIntensity = damp(eyes.emissiveIntensity, action ? 5 : 3, 8, d);

    // ── Light strips: slow pulse, brighter during actions, gold on deploy
    const strips = materials.get("lambert4") as THREE.MeshStandardMaterial | undefined;
    if (strips) {
      strips.emissiveIntensity = 1.4 + Math.sin(t * 2) * 0.4 + env * 2;
      strips.emissive.set(action === "deploy" ? "#ffc46b" : ACCENT);
      strips.color.copy(strips.emissive);
    }

    // ── Scan beam from the visor
    if (beam.current) {
      const m = beam.current.material as THREE.MeshBasicMaterial;
      m.opacity = action === "scan" ? env * (0.16 + Math.sin(t * 30) * 0.03) : 0;
      beam.current.visible = m.opacity > 0.005;
    }

    // ── Legs: typing taps with the front legs, firm stance on deploy, scan shuffle
    LEGS.forEach((leg, i) => {
      const g = legRefs.current[leg];
      if (!g) return;
      const front = leg === "Leg_FL" || leg === "Leg_FR";
      let a = 0;
      if (isTyping && front) {
        const phase = leg === "Leg_FL" ? 0 : Math.PI * 0.85;
        const tap = Math.max(0, Math.sin(t * 9 + phase));
        a = 0.16 + tap * 0.14;
        if (broadcast && tap > 0.98) robotSignal.lastTap = t;
      } else if (action === "deploy") {
        a = -0.12 * env;
      } else if (action === "scan") {
        a = Math.max(0, Math.sin(p * Math.PI * 4 + i * 1.6)) * 0.08 * env;
      }
      const next = damp(g.userData.angle ?? 0, a, 14, d);
      g.userData.angle = next;
      q.setFromAxisAngle(legAxes[leg], next);
      g.quaternion.copy(q);
    });
  });

  const n = nodes as Record<string, THREE.Object3D>;
  const eyeCenter = useMemo(
    () => new THREE.Vector3().addVectors(n.Eye_L.position, n.Eye_R.position).multiplyScalar(0.5),
    [n]
  );

  return (
    <group
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        run();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* The model faces +X; turn it toward the camera */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <group ref={upper}>
          <Part node={n.Body} materials={materials} />
          <group ref={head} position={n.Head.position}>
            <Part node={n.Head} materials={materials} />
            <group ref={eyeL} position={n.Eye_L.position}>
              <Part node={n.Eye_L} materials={materials} />
            </group>
            <group ref={eyeR} position={n.Eye_R.position}>
              <Part node={n.Eye_R} materials={materials} />
            </group>
            {/* Scan fan: apex at the eyes, opening forward (+X) */}
            <mesh ref={beam} position={[eyeCenter.x + 2.2, eyeCenter.y - 0.35, 0]} rotation={[0, 0, Math.PI / 2 + 0.16]} scale={[1, 1, 0.08]} visible={false}>
              <coneGeometry args={[1.6, 4.4, 32, 1, true]} />
              <meshBasicMaterial color={ACCENT} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
            </mesh>
          </group>
          {LEGS.map((leg) => (
            <group
              key={leg}
              position={n[leg].position}
              ref={(el) => {
                legRefs.current[leg] = el;
              }}
            >
              <Part node={n[leg]} materials={materials} />
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ROBOT_URL);

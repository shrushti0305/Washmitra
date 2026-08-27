import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  MeshTransmissionMaterial,
  AdaptiveDpr,
} from '@react-three/drei';
import * as THREE from 'three';

/* ----------------------------------------------------------------------------
   Brand palette (mirrors the existing WASH Mitra design tokens)
---------------------------------------------------------------------------- */
const BRAND = {
  teal: '#062D27',
  orange: '#F26522',
  green: '#2EB67D',
  water: '#7FD7F0',
  steel: '#9FB3B0',
  solar: '#0B2746',
  cyan: '#39C2FF',
};

/* ----------------------------------------------------------------------------
   Water droplet — the signature element.
   A lathed tear-drop profile rendered with a glassy transmission material.
---------------------------------------------------------------------------- */
function useDropletGeometry() {
  return useMemo(() => {
    // Profile from the bottom pole up to the pointed tip, revolved around Y.
    const profile = [
      new THREE.Vector2(0.0, -1.05),
      new THREE.Vector2(0.55, -0.92),
      new THREE.Vector2(0.92, -0.55),
      new THREE.Vector2(1.02, -0.05),
      new THREE.Vector2(0.93, 0.42),
      new THREE.Vector2(0.62, 0.86),
      new THREE.Vector2(0.3, 1.18),
      new THREE.Vector2(0.0, 1.5),
    ];
    // Smooth the silhouette so the bulb reads as liquid, not faceted.
    const curve = new THREE.SplineCurve(profile);
    const points = curve.getPoints(40).map((p) => new THREE.Vector2(Math.max(p.x, 0), p.y));
    const geo = new THREE.LatheGeometry(points, 48);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Droplet() {
  const geometry = useDropletGeometry();
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.25;
    group.current.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow scale={1.18}>
        <MeshTransmissionMaterial
          resolution={256}
          thickness={0.8}
          roughness={0.06}
          transmission={0.95}
          ior={1.33}
          chromaticAberration={0.02}
          color={BRAND.water}
          attenuationColor={BRAND.green}
          attenuationDistance={2.5}
          background={new THREE.Color('#eaf6f3')}
        />
      </mesh>
      {/* Inner highlight core gives the drop depth without an HDR map */}
      <mesh scale={0.42} position={[0.18, -0.15, 0.18]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={BRAND.cyan}
          emissive={BRAND.cyan}
          emissiveIntensity={0.35}
          roughness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------------------
   Orbiting "skill modules" — the multi-trade cadre from the concept note.
   Each is a small procedural model placed on a tilted orbit.
---------------------------------------------------------------------------- */
function Orbit({
  radius,
  speed,
  phase,
  tilt,
  children,
}: {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const a = state.clock.elapsedTime * speed + phase;
    ref.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius * Math.sin(tilt), Math.sin(a) * radius * Math.cos(tilt));
  });
  return (
    <group ref={ref}>
      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.4}>
        {children}
      </Float>
    </group>
  );
}

function Pipe() {
  return (
    <group rotation={[0, 0, Math.PI / 4]} scale={0.5}>
      <mesh castShadow>
        <cylinderGeometry args={[0.26, 0.26, 1.1, 24]} />
        <meshStandardMaterial color={BRAND.orange} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.18, 24]} />
        <meshStandardMaterial color="#fff" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.62, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.18, 24]} />
        <meshStandardMaterial color="#fff" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Filter() {
  return (
    <group scale={0.5}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.0, 28]} />
        <meshStandardMaterial color={BRAND.teal} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.4, 0.22, 28]} />
        <meshStandardMaterial color={BRAND.green} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 16]} />
        <meshStandardMaterial color="#cfd8d6" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SolarPanel() {
  return (
    <group rotation={[-0.5, 0.4, 0]} scale={0.6}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.05, 0.8]} />
        <meshStandardMaterial color={BRAND.solar} metalness={0.5} roughness={0.25} />
      </mesh>
      {/* Cell grid lines as thin emissive strips */}
      {[-0.36, 0, 0.36].map((x) => (
        <mesh key={`v${x}`} position={[x, 0.03, 0]}>
          <boxGeometry args={[0.015, 0.02, 0.78]} />
          <meshStandardMaterial color={BRAND.cyan} emissive={BRAND.cyan} emissiveIntensity={0.6} />
        </mesh>
      ))}
      {[-0.25, 0.25].map((z) => (
        <mesh key={`h${z}`} position={[0, 0.03, z]}>
          <boxGeometry args={[1.08, 0.02, 0.015]} />
          <meshStandardMaterial color={BRAND.cyan} emissive={BRAND.cyan} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Tap() {
  return (
    <group rotation={[0, 0, 0]} scale={0.5}>
      <mesh position={[-0.1, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 20]} />
        <meshStandardMaterial color={BRAND.steel} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0.05, 0.18, 0]} rotation={[0, 0, Math.PI / 2.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 20]} />
        <meshStandardMaterial color={BRAND.steel} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[-0.1, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={BRAND.orange} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function HexNut() {
  return (
    <mesh scale={0.5} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.28, 6]} />
      <meshStandardMaterial color={BRAND.green} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

/* ----------------------------------------------------------------------------
   Rising bubbles — ambient atmosphere using instanced spheres.
---------------------------------------------------------------------------- */
function Bubbles({ count = 26 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 4,
        y0: -2 - Math.random() * 3,
        speed: 0.3 + Math.random() * 0.6,
        scale: 0.04 + Math.random() * 0.1,
        drift: Math.random() * Math.PI * 2,
      })),
    [count]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const y = ((s.y0 + t * s.speed) % 6) - 2.5;
      dummy.position.set(s.x + Math.sin(t * 0.5 + s.drift) * 0.2, y, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color={BRAND.water} transparent opacity={0.35} roughness={0.1} />
    </instancedMesh>
  );
}

/* ----------------------------------------------------------------------------
   Scene wiring
---------------------------------------------------------------------------- */
function Scene({ interactive }: { interactive: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} castShadow color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color={BRAND.green} />

      {/* Local environment (lightformers) — no remote HDR fetch needed */}
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[6, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 3, 1]} color={BRAND.water} />
        <Lightformer intensity={1.2} position={[4, -1, 2]} scale={[3, 3, 1]} color={BRAND.orange} />
      </Environment>

      <group position={[0, 0.1, 0]}>
        <Droplet />
        <Orbit radius={2.5} speed={0.45} phase={0} tilt={0.5}>
          <Pipe />
        </Orbit>
        <Orbit radius={2.5} speed={0.45} phase={(Math.PI * 2) / 5} tilt={0.5}>
          <Filter />
        </Orbit>
        <Orbit radius={2.5} speed={0.45} phase={(Math.PI * 4) / 5} tilt={0.5}>
          <SolarPanel />
        </Orbit>
        <Orbit radius={2.5} speed={0.45} phase={(Math.PI * 6) / 5} tilt={0.5}>
          <Tap />
        </Orbit>
        <Orbit radius={2.5} speed={0.45} phase={(Math.PI * 8) / 5} tilt={0.5}>
          <HexNut />
        </Orbit>
      </group>

      <Bubbles />

      <ContactShadows position={[0, -1.8, 0]} opacity={0.35} scale={9} blur={2.6} far={4} color={BRAND.teal} />

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.6}
        />
      )}
      <AdaptiveDpr pixelated />
    </>
  );
}

export interface WashScene3DProps {
  className?: string;
  interactive?: boolean;
}

export default function WashScene3D({ className = '', interactive = true }: WashScene3DProps) {
  const [failed, setFailed] = useState(false);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-40 h-52 rounded-[40%_40%_45%_45%/55%_55%_45%_45%] bg-gradient-to-b from-[#7FD7F0] to-[#2EB67D] shadow-2xl opacity-80" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        shadows={false}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.5, 7], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setFailed(true)}
      >
        <Suspense fallback={null}>
          <Scene interactive={interactive && !prefersReduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}

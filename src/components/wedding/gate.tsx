import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Group, SRGBColorSpace, MathUtils } from "three";
import gateAsset from "@/assets/royal-gate.png.asset.json";

function Doors({ open, ready }: { open: boolean; ready: () => void }) {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const loaded = useRef(false);
  const source = useTexture(gateAsset.url);
  const textures = useMemo(() => [0, 1].map(side => {
    const texture = source.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.set(0.5, 1);
    texture.offset.set(side * 0.5, 0);
    texture.needsUpdate = true;
    return texture;
  }), [source]);
  useFrame((state, delta) => {
    if (!loaded.current) { loaded.current = true; ready(); }
    const dt = Math.min(delta, 0.05);
    if (left.current) left.current.rotation.y = MathUtils.damp(left.current.rotation.y, open ? -1.65 : 0, 4, dt);
    if (right.current) right.current.rotation.y = MathUtils.damp(right.current.rotation.y, open ? 1.65 : 0, 4, dt);
    state.camera.position.x = MathUtils.damp(state.camera.position.x, state.pointer.x * 0.12, 3, dt);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, open ? 4.4 : 5.4, 2, dt);
    state.camera.lookAt(0, 0, 0);
  });
  return <>
    <group ref={left} position={[-1, 0, 0]}><mesh position={[0.5, 0, 0]}><boxGeometry args={[1, 3, 0.08]} /><meshStandardMaterial map={textures[0] ?? null} roughness={0.48} metalness={0.2} /></mesh></group>
    <group ref={right} position={[1, 0, 0]}><mesh position={[-0.5, 0, 0]}><boxGeometry args={[1, 3, 0.08]} /><meshStandardMaterial map={textures[1] ?? null} roughness={0.48} metalness={0.2} /></mesh></group>
  </>;
}

export function OpeningGate({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  return <div className="gate-scene" ref={wrapper} onPointerDown={e => { start.current = e.clientX; }} onPointerUp={e => { if (Math.abs(e.clientX - start.current) > 35) onOpen(); }}>
    <Canvas camera={{ position: [0, 0, 5.4], fov: 36 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.5} /><directionalLight position={[2, 4, 5]} intensity={2} />
      <Environment resolution={64}><Lightformer intensity={2} position={[0, 5, 3]} scale={[10, 10, 1]} /></Environment>
      <Suspense fallback={null}><Doors open={open} ready={() => wrapper.current?.setAttribute("data-scene-ready", "true")} /></Suspense>
    </Canvas>
  </div>;
}
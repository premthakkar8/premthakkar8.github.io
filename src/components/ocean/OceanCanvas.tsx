"use client";
"use no memo";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { scrollState } from "@/lib/scroll";
import { cameraHeight, cameraPitch, env, updateEnvironment } from "./env";
import { JellyfishBloom } from "./Jellyfish";
import { LightRays } from "./LightRays";
import { Bioluminescence, Bubbles, MarineSnow } from "./Particles";
import { Sky } from "./Sky";
import { Water } from "./Water";

function Director() {
  const smooth = useRef({ y: -1, px: 0, py: 0 });

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    env.time += dt * (env.reducedMotion ? 0.3 : 1);

    const s = smooth.current;
    if (s.y < 0) s.y = scrollState.y;
    const k = 1 - Math.exp(-dt * 3.5);
    s.y += (scrollState.y - s.y) * k;
    const pk = env.reducedMotion ? 0 : 1;
    s.px += (scrollState.px * pk - s.px) * k * 0.6;
    s.py += (scrollState.py * pk - s.py) * k * 0.6;

    const camY = cameraHeight(s.y, scrollState.vh, scrollState.max);
    updateEnvironment(camY, size.width / size.height);

    camera.position.set(s.px * 0.45 + Math.sin(env.time * 0.13) * 0.2, camY + s.py * 0.2, 8);
    camera.rotation.set(cameraPitch(camY) + s.py * 0.02, -s.px * 0.05, 0, "YXZ");
  });

  return null;
}

export default function OceanCanvas({ onReady }: { onReady?: () => void }) {
  const high = env.quality === "high";
  return (
    <Canvas
      flat
      dpr={[1, high ? 1.75 : 1.25]}
      gl={{ antialias: high, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.1, far: 700, position: [0, 3.2, 8] }}
      onCreated={({ scene }) => {
        scene.background = env.fogColor;
        onReady?.();
      }}
      fallback={null}
    >
      <Director />
      <Sky />
      <Water />
      <LightRays />
      <MarineSnow />
      <Bubbles />
      <Bioluminescence />
      <JellyfishBloom />
    </Canvas>
  );
}

"use client";
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { creatureVertex, sharkGeometry } from "./creatures";
import { env } from "./env";

type SharkConfig = { y: number; z: number; dir: 1 | -1; speed: number; scale: number; phase: number };

const SCHOOL: SharkConfig[] = [
  { y: -8.5, z: -11, dir: 1, speed: 1.0, scale: 0.85, phase: 0.1 },
  { y: -15, z: -14, dir: -1, speed: 0.8, scale: 1.15, phase: 0.55 },
  { y: -21, z: -9, dir: 1, speed: 1.2, scale: 0.75, phase: 0.3 },
  { y: -29, z: -15, dir: -1, speed: 0.9, scale: 1.3, phase: 0.8 },
  { y: -38, z: -10, dir: 1, speed: 1.1, scale: 0.95, phase: 0.45 },
  { y: -50, z: -13, dir: -1, speed: 0.85, scale: 1.1, phase: 0.2 },
];

const CAMERA_Z = 8;

const sharkFragment = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uLight;
  varying vec3 vN;
  varying vec3 vWorld;

  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 toCam = cameraPosition - vWorld;
    float dist = length(toCam);
    vec3 v = toCam / dist;

    vec3 back = vec3(0.035, 0.07, 0.1);
    vec3 belly = vec3(0.16, 0.22, 0.26);
    vec3 col = mix(belly, back, smoothstep(-0.3, 0.3, n.y));
    col *= 0.6 + 0.4 * clamp(n.y * 0.5 + 0.5, 0.0, 1.0) * uLight;
    float rim = pow(1.0 - abs(dot(n, v)), 3.0);
    col += vec3(0.25, 0.65, 0.85) * rim * 0.18;

    float fog = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
    col = mix(col, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Shark({ cfg, geometry }: { cfg: SharkConfig; geometry: THREE.BufferGeometry }) {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: creatureVertex,
        fragmentShader: sharkFragment,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uSwim: { value: 5.5 + cfg.speed * 1.5 },
          uAmp: { value: 0.09 },
          uFogColor: { value: new THREE.Color() },
          uFogDensity: { value: 0.05 },
          uLight: { value: 1 },
        },
      }),
    [cfg.speed],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    m.visible = env.under > 0.5 && Math.abs(env.camY - cfg.y) < 16;
    if (!m.visible) return;

    const distance = CAMERA_Z - cfg.z;
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(27.5)) * distance * env.aspect;
    const range = halfWidth * 2 + 8;
    const travel = (env.time * cfg.speed + cfg.phase * range) % range;
    const t = env.time + cfg.phase * 10;

    m.position.set(cfg.dir * (travel - range / 2), cfg.y + Math.sin(t * 0.4) * 0.3, cfg.z + Math.sin(t * 0.23) * 0.6);
    m.rotation.set(0, (cfg.dir > 0 ? 0 : Math.PI) + Math.sin(t * 0.5) * 0.08, Math.sin(t * 0.4) * 0.04);

    const u = material.uniforms;
    u.uTime.value = env.time;
    u.uFogColor.value.copy(env.fogColor);
    u.uFogDensity.value = env.fogDensity;
    u.uLight.value = 1 - env.deep * 0.7;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} scale={cfg.scale} frustumCulled={false} />;
}

export function Sharks() {
  const geometry = useMemo(() => sharkGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const school = env.quality === "high" ? SCHOOL : SCHOOL.filter((_, i) => i % 2 === 0);
  return (
    <>
      {school.map((cfg, i) => (
        <Shark key={i} cfg={cfg} geometry={geometry} />
      ))}
    </>
  );
}

"use client";
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { env, smoothstep } from "./env";

type JellyConfig = {
  y: number;
  side: 1 | -1;
  z: number;
  scale: number;
  color: string;
  length: number;
  speed: number;
  phase: number;
  tilt: number;
};

const BLOOM: JellyConfig[] = [
  { y: -14, side: 1, z: -2, scale: 0.85, color: "#5eead4", length: 3.2, speed: 1.0, phase: 0, tilt: 0.12 },
  { y: -24, side: -1, z: -5, scale: 1.2, color: "#38bdf8", length: 4.2, speed: 0.85, phase: 2.1, tilt: -0.1 },
  { y: -35, side: 1, z: -7, scale: 1.45, color: "#a78bfa", length: 5.0, speed: 0.75, phase: 4.2, tilt: 0.08 },
  { y: -46, side: -1, z: -3, scale: 1.05, color: "#22d3ee", length: 3.8, speed: 0.95, phase: 1.3, tilt: -0.14 },
  { y: -56, side: 1, z: -4, scale: 0.8, color: "#818cf8", length: 3.0, speed: 1.1, phase: 3.4, tilt: 0.1 },
];

const TENTACLES = 10;
const SEGMENTS = 28;

const bellVertex = /* glsl */ `
  uniform float uPulse;
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vV;
  varying float vY;

  void main() {
    vec3 p = position;
    float rim = 1.0 - p.y;
    p.xz *= 1.0 - 0.11 * uPulse * rim;
    p.y *= 1.0 + 0.13 * uPulse;
    p.y += 0.035 * sin(atan(p.z, p.x) * 8.0 + uTime * 2.0) * rim * rim;
    vY = position.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalMatrix * normal;
    vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const bellFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vV;
  varying float vY;

  void main() {
    float ndv = abs(dot(normalize(vN), normalize(vV)));
    float fresnel = pow(1.0 - ndv, 2.2);
    float bands = 0.5 + 0.5 * sin(vY * 26.0 - uTime * 1.8);
    float a = (0.05 + fresnel * 0.85 + bands * 0.05) * uAlpha;
    vec3 col = uColor * (0.55 + fresnel * 1.5) + vec3(0.6, 0.9, 1.0) * smoothstep(0.7, 1.0, vY) * 0.3;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

function Jelly({ cfg }: { cfg: JellyConfig }) {
  const group = useRef<THREE.Group>(null);

  const bellGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), []);
  const bellMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: bellVertex,
        fragmentShader: bellFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(cfg.color) },
          uAlpha: { value: 0 },
          uPulse: { value: 0 },
          uTime: { value: 0 },
        },
      }),
    [cfg.color],
  );

  const tentacles = useMemo(() => {
    const color = new THREE.Color(cfg.color);
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    return Array.from({ length: TENTACLES }, () => {
      const geometry = new THREE.BufferGeometry();
      const colors = new Float32Array(SEGMENTS * 3);
      for (let s = 0; s < SEGMENTS; s++) {
        const fade = Math.pow(1 - s / (SEGMENTS - 1), 1.6);
        colors[s * 3] = color.r * fade;
        colors[s * 3 + 1] = color.g * fade;
        colors[s * 3 + 2] = color.b * fade;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SEGMENTS * 3), 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      return new THREE.Line(geometry, material);
    });
  }, [cfg.color]);

  useEffect(
    () => () => {
      bellGeometry.dispose();
      bellMaterial.dispose();
      tentacles.forEach((t) => t.geometry.dispose());
      (tentacles[0]?.material as THREE.Material | undefined)?.dispose();
    },
    [bellGeometry, bellMaterial, tentacles],
  );

  useFrame(({ camera }) => {
    const g = group.current;
    if (!g) return;
    const t = env.time * cfg.speed + cfg.phase;
    const pulse = Math.sin(t * 1.7);

    const distance = 8 - cfg.z;
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(27.5)) * distance * env.aspect;
    g.position.set(
      cfg.side * Math.min(7, Math.max(1.6, halfWidth * 0.68)) + Math.sin(t * 0.21) * 0.4,
      cfg.y + Math.sin(t * 0.35) * 0.5 + Math.max(0, pulse) * 0.08,
      cfg.z,
    );

    const d = camera.position.distanceTo(g.position);
    const alpha = Math.exp(-Math.pow(env.fogDensity * d, 2)) * smoothstep(-4, -9, env.camY);
    g.visible = alpha > 0.01;
    if (!g.visible) return;

    const u = bellMaterial.uniforms;
    u.uAlpha.value = alpha;
    u.uPulse.value = pulse;
    u.uTime.value = env.time;

    const rimRadius = 0.82 * (1 - 0.1 * pulse);
    tentacles.forEach((line, i) => {
      const a = (i / TENTACLES) * Math.PI * 2;
      const pos = line.geometry.attributes.position as THREE.BufferAttribute;
      for (let s = 0; s < SEGMENTS; s++) {
        const f = s / (SEGMENTS - 1);
        const sway = Math.sin(t * 1.2 - f * 4 + i) * 0.28 * f;
        const drift = Math.sin(t * 0.6 - f * 2) * 0.18 * f;
        const r = rimRadius * (1 - 0.4 * f);
        pos.setXYZ(
          s,
          Math.cos(a) * r + sway * Math.cos(a + 1.3) + drift,
          -0.02 - f * cfg.length,
          Math.sin(a) * r + sway * Math.sin(a + 1.3),
        );
      }
      pos.needsUpdate = true;
    });
    (tentacles[0].material as THREE.LineBasicMaterial).opacity = alpha * 0.85;
  });

  return (
    <group ref={group} scale={cfg.scale} rotation={[cfg.tilt, 0, cfg.tilt * 0.5]}>
      <mesh geometry={bellGeometry} material={bellMaterial} />
      {tentacles.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

export function JellyfishBloom() {
  const bloom = env.quality === "high" ? BLOOM : BLOOM.filter((_, i) => i % 2 === 0);
  return (
    <>
      {bloom.map((cfg, i) => (
        <Jelly key={i} cfg={cfg} />
      ))}
    </>
  );
}
